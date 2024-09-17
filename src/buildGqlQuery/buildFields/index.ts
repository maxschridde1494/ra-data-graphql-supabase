import {
  IntrospectionResult,
  IntrospectedResource,
} from 'ra-data-graphql';
import {
  IntrospectionField,
  IntrospectionObjectType,
  IntrospectionType,
  IntrospectionUnionType,
  TypeKind,
} from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

import getFinalType from '../../getFinalType';
import { processSparseFields, SparseField } from './processSparseFields';
import { supabaseFieldsForObject } from './supabaseFieldsForObject';
import { buildFragments } from './buildFragments';

export const buildFields = (introspectionResults: IntrospectionResult, paths: string[] = []) =>
({
  resourceObject,
  typeObject,
  fieldsProp,
  sparseFields,
}: { 
  resourceObject?: IntrospectedResource,
  typeObject?: IntrospectionType,
  fieldsProp: IntrospectionField[],
  sparseFields?: SparseField[] 
}): any => {  
  let { fields } = supabaseFieldsForObject({ introspectionResults, resourceObject, typeObject, fields: fieldsProp })

  const { resourceFields, linkedSparseFields } = sparseFields
      ? processSparseFields(fields, sparseFields)
      : { resourceFields: fields, linkedSparseFields: [] };

  const nodeIdField = fields.find(f => f.name === 'nodeId')
  if (nodeIdField && !resourceFields.find(f => f.name === 'nodeId')) resourceFields.push(nodeIdField)

  return resourceFields.reduce((acc: any, field: IntrospectionField) => {
      const type = getFinalType(field.type);

      if (type.name.startsWith('_')) {
          return acc;
      }

      if (
          type.kind !== TypeKind.OBJECT &&
          type.kind !== TypeKind.INTERFACE
      ) {
          return [...acc, gqlTypes.field(gqlTypes.name(field.name))];
      }

      const linkedResourceObject = introspectionResults.resources.find(
          r => r.type.name === type.name
      );

      let gqlSelectionSet

      if (linkedResourceObject) {
          let { object, fields: linkedResourceFields} = supabaseFieldsForObject({ 
              introspectionResults, 
              resourceObject: linkedResourceObject, 
              fields: linkedResourceObject.type.fields as IntrospectionField[]
          })

          const linkedResource = object as IntrospectedResource
          
          const linkedResourceSparseFields = linkedSparseFields.find(
              lSP => lSP.linkedType === field.name
          )?.fields || ['id', 'nodeId']; // always include id and nodeId for linked resources
          
          gqlSelectionSet = gqlTypes.selectionSet(
              buildFields(introspectionResults)({
                  resourceObject: linkedResource,
                  fieldsProp: linkedResourceFields,
                  sparseFields: linkedResourceSparseFields
              })
          )
      }

      if (!gqlSelectionSet) {
          let linkedTypeObject = introspectionResults.types.find(
              t => t.name === type.name
          ) as IntrospectionObjectType

          const { object, fields: linkedTypeFields } = supabaseFieldsForObject({ 
              introspectionResults, 
              typeObject: linkedTypeObject, 
              fields: linkedTypeObject?.fields as IntrospectionField[]
          })

          const linkedType = object as IntrospectionType

          if (linkedType && !paths.includes(linkedType.name)) {
              const possibleTypes =
                  (linkedType as IntrospectionUnionType).possibleTypes || [];
              
              const linkedTypeSparseFields = linkedSparseFields.find(
                  lSP => lSP.linkedType === field.name
              )?.fields || ['id', 'nodeId']; // always include id and nodeId for linked resources
              
              gqlSelectionSet = gqlTypes.selectionSet([
                  gqlTypes.field(gqlTypes.name('totalCount')),
                  gqlTypes.field(
                      gqlTypes.name('edges'), 
                      null, 
                      null, 
                      null, 
                      gqlTypes.selectionSet([
                          gqlTypes.field(
                              gqlTypes.name('node'), 
                              null, 
                              null, 
                              null, 
                              gqlTypes.selectionSet([
                                  ...buildFragments(introspectionResults)(
                                      possibleTypes
                                  ),
                                  ...buildFields(introspectionResults, [
                                      ...paths,
                                      linkedType.name,
                                  ])({
                                      typeObject: linkedType,
                                      fieldsProp: linkedTypeFields,
                                      sparseFields: linkedTypeSparseFields
                                  }),
                              ])
                          )
                      ])
                  )
              ])
          }
      }

      if (gqlSelectionSet) {
          return [
              ...acc,
              gqlTypes.field(
                  gqlTypes.name(field.name),
                  null,
                  null,
                  null,
                  gqlSelectionSet
              ),
          ];
      }

      // NOTE: We might have to handle linked types which are not resources but will have to be careful about
      // ending with endless circular dependencies
      
      return acc;
  }, []);
};