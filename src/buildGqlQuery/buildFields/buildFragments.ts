import { IntrospectionResult } from 'ra-data-graphql';
import {
  IntrospectionField,
  IntrospectionNamedTypeRef,
  IntrospectionObjectType,
  IntrospectionType,
} from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

import getFinalType from '../../getFinalType';
import { buildFields } from './';

export const buildFragments = (introspectionResults: IntrospectionResult) =>
  (possibleTypes: readonly IntrospectionNamedTypeRef<IntrospectionObjectType>[]) =>
      possibleTypes.reduce((acc: any, possibleType) => {
          const type = getFinalType(possibleType);

          const linkedType = introspectionResults.types.find(
              t => t.name === type.name
          ) as IntrospectionType;

          return [
              ...acc,
              gqlTypes.inlineFragment(
                  gqlTypes.selectionSet(
                      buildFields(introspectionResults)({
                          resourceObject: introspectionResults.resources.find(r => r.type.name === linkedType.name),
                          fieldsProp: (linkedType as IntrospectionObjectType).fields as IntrospectionField[]
                      })
                  ),
                  gqlTypes.namedType(gqlTypes.name(type.name))
              ),
          ];
      }, []);