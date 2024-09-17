import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    CREATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
  } from 'ra-core';
  import {
    IntrospectionResult,
    IntrospectedResource,
  } from 'ra-data-graphql';
  import {
    ArgumentNode,
    IntrospectionField,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionType,
    IntrospectionUnionType,
    TypeKind,
    VariableDefinitionNode,
  } from 'graphql';
  import * as gqlTypes from 'graphql-ast-types-browser';
  
  import getFinalType from './getFinalType';
  import { getGqlType } from './getGqlType';
  
  type SparseField = string | { [k: string]: SparseField[] };
  type ExpandedSparseField = { linkedType?: string; fields: SparseField[] };
  type ProcessedFields = {
    resourceFields: IntrospectionField[];
    linkedSparseFields: ExpandedSparseField[];
  };
  
function processSparseFields(
    resourceFields: IntrospectionField[],
    sparseFields: SparseField[]
): ProcessedFields & { resourceFields: readonly IntrospectionField[] } {
    if (!sparseFields || sparseFields.length === 0)
        throw new Error(
            "Empty sparse fields. Specify at least one field or remove the 'sparseFields' param"
        );
  
    const permittedSparseFields: ProcessedFields = sparseFields.reduce(
        (permitted: ProcessedFields, sparseField: SparseField) => {
            let expandedSparseField: ExpandedSparseField;
            if (typeof sparseField == 'string')
                expandedSparseField = { fields: [sparseField] };
            else {
                const [linkedType, linkedSparseFields] =
                    Object.entries(sparseField)[0];
                expandedSparseField = {
                    linkedType,
                    fields: linkedSparseFields,
                };
            }
  
            const availableField = resourceFields.find(
                resourceField =>
                    resourceField.name ===
                    (expandedSparseField.linkedType ||
                        expandedSparseField.fields[0])
            );
  
            if (availableField && expandedSparseField.linkedType) {
                permitted.linkedSparseFields.push(expandedSparseField);
                permitted.resourceFields.push(availableField);
            } else if (availableField)
                permitted.resourceFields.push(availableField);
  
            return permitted;
        },
        { resourceFields: [], linkedSparseFields: [] }
    ); // ensure the requested fields are available
  
    if (
        permittedSparseFields.resourceFields.length === 0 &&
        permittedSparseFields.linkedSparseFields.length === 0
    )
        throw new Error(
            "Requested sparse fields not found. Ensure sparse fields are available in the resource's type"
        );
    
    return permittedSparseFields;
}
  
export default (introspectionResults: IntrospectionResult) =>
    (
        resource: IntrospectedResource,
        raFetchMethod: string,
        queryType: IntrospectionField,
        variables: any
    ) => {
        // let { orderBy, ...metaVariables } = variables;
  
        const apolloArgs = buildApolloArgs(queryType, variables, raFetchMethod);
        const args = buildArgs(queryType, variables, raFetchMethod);
  
        // const sparseFields = metaVariables.meta?.sparseFields;
        // if (sparseFields) delete metaVariables.meta.sparseFields;
        // const metaArgs = buildArgs(queryType, metaVariables);
        
        let sparseFields: any;
        if (variables.meta) {
            sparseFields = variables.meta?.sparseFields;
            delete variables.meta.sparseFields;
        } else if (variables.data?.meta){
            // create case
            sparseFields = variables.data.meta.sparseFields;
            delete variables.data.meta.sparseFields;
        }
  

        const fields = buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields as IntrospectionField[],
            sparseFields,
        });
  
        if (
            raFetchMethod === GET_LIST ||
            raFetchMethod === GET_MANY ||
            raFetchMethod === GET_MANY_REFERENCE
        ) {
            return gqlTypes.document([
                gqlTypes.operationDefinition(
                    'query',
                    gqlTypes.selectionSet([
                        gqlTypes.field(
                            gqlTypes.name(queryType.name),
                            gqlTypes.name('items'),
                            args,
                            null,
                            gqlTypes.selectionSet([
                              gqlTypes.field(gqlTypes.name('totalCount')),
                              gqlTypes.field(gqlTypes.name('edges'), null, null, null, gqlTypes.selectionSet([
                                gqlTypes.field(gqlTypes.name('node'), null, null, null, gqlTypes.selectionSet(fields))
                              ]))
                            ])
                        ),
                    ]),
                    gqlTypes.name(queryType.name),
                    apolloArgs
                ),
            ]);
        }

        if (raFetchMethod === GET_ONE) {
            return gqlTypes.document([
                gqlTypes.operationDefinition(
                    'query',
                    gqlTypes.selectionSet([
                        gqlTypes.field(
                            gqlTypes.name(queryType.name),
                            gqlTypes.name('data'),
                            args,
                            null,
                            gqlTypes.selectionSet(fields)
                        ),
                    ]),
                    gqlTypes.name(queryType.name),
                    apolloArgs
                ),
            ]);
        }

        if (
            raFetchMethod === UPDATE || 
            raFetchMethod === CREATE || 
            raFetchMethod === DELETE ||
            raFetchMethod === DELETE_MANY ||
            raFetchMethod === UPDATE_MANY
        ) {
            return gqlTypes.document([
                gqlTypes.operationDefinition(
                    'mutation',
                    gqlTypes.selectionSet([
                        gqlTypes.field(
                            gqlTypes.name(queryType.name),
                            gqlTypes.name('data'),
                            args,
                            null,
                            gqlTypes.selectionSet([
                                gqlTypes.field(gqlTypes.name('affectedCount')),
                                gqlTypes.field(
                                    gqlTypes.name('records'), 
                                    null, 
                                    null, 
                                    null, 
                                    gqlTypes.selectionSet(fields)
                                )
                            ])
                        ),
                    ]),
                    gqlTypes.name(queryType.name),
                    apolloArgs
                ),
            ]);
        }
    };

const fieldsForObject = ({ 
    introspectionResults, 
    resourceObject,
    typeObject,
    fields,
} : { 
    introspectionResults: IntrospectionResult, 
    resourceObject?: IntrospectedResource
    typeObject?: IntrospectionType //IntrospectionObjectType,
    fields: IntrospectionField[], 
}) => {
    if (!(resourceObject || typeObject)) return { object: null, fields: fields }

    const type = resourceObject?.type || typeObject as IntrospectionObjectType | IntrospectionType // as IntrospectionObjectType

    if (!type.name.endsWith('Connection')) return { object: resourceObject || typeObject, fields }

    const object = resourceObject ? 
                        introspectionResults.resources.find(r => r.type.name === type.name.replace('Connection', '')) as IntrospectedResource
                        : introspectionResults.types.find(t => t.name === type.name.replace('Connection', '')) as IntrospectionType

    return { object, fields: (resourceObject ? (object as IntrospectedResource).type.fields : (object as IntrospectionObjectType).fields) as IntrospectionField[] }
}
  
export const buildFields = (introspectionResults: IntrospectionResult, paths: string[] = []) =>
    ({
        resourceObject,
        typeObject,
        fieldsProp,
        sparseFields,
    }: { 
        resourceObject?: IntrospectedResource,
        typeObject?: IntrospectionType// IntrospectionObjectType,
        fieldsProp: IntrospectionField[],
        sparseFields?: SparseField[] 
    }): any => {  
        let { fields } = fieldsForObject({ introspectionResults, resourceObject, typeObject, fields: fieldsProp })
  
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
                let { object, fields: linkedResourceFields} = fieldsForObject({ 
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
    
                const { object, fields: linkedTypeFields } = fieldsForObject({ 
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
  
export const buildArgs = (
    query: IntrospectionField,
    variables: any,
    raFetchMethod: string
): ArgumentNode[] => {
    if (query.args.length === 0) {
        return [];
    }
  
    const validVariables = Object.keys(variables).filter(
      k => typeof variables[k] !== 'undefined'
    )

    if (raFetchMethod === UPDATE || raFetchMethod === UPDATE_MANY) {
        validVariables.push('filter')
        validVariables.push('set')
        validVariables.push('atMost')
    } else if (raFetchMethod === DELETE || raFetchMethod === DELETE_MANY) {
        validVariables.push('filter')
        validVariables.push('atMost')
    } else if (raFetchMethod === CREATE) {
        validVariables.push('objects')
    } else {
        const { sortField, sortOrder, page, perPage } = variables
        if (sortField && sortOrder) validVariables.push('orderBy')
        if (page && perPage) {
          validVariables.push('offset')
          validVariables.push('first')
        }
    }
  
    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce(
            (acc: any, arg) => [
              ...acc,
              gqlTypes.argument(
                  gqlTypes.name(query.name === 'node' ? 'nodeId' : arg.name),
                  gqlTypes.variable(gqlTypes.name(arg.name))
              ),
            ],
            []
        );
  
    return args;
  };
  
export const buildApolloArgs = (
    query: IntrospectionField,
    variables: any,
    raFetchMethod: string
): VariableDefinitionNode[] => {
    if (query.args.length === 0) {
        return [];
    }
  
    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );

    if (raFetchMethod === UPDATE || raFetchMethod === UPDATE_MANY) {
        validVariables.push('filter')
        validVariables.push('set')
        validVariables.push('atMost')
    } else if (raFetchMethod === CREATE) {
        validVariables.push('objects')
    } else if (raFetchMethod === DELETE || raFetchMethod === DELETE_MANY) {
        validVariables.push('filter')
        validVariables.push('atMost')
    } else {
        const { sortField, sortOrder, page, perPage } = variables
        if (sortField && sortOrder) validVariables.push('orderBy')
        if (page && perPage) {
          validVariables.push('offset')
          validVariables.push('first')
        }
    }
  
    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce((acc: any, arg) => {
            return [
                ...acc,
                gqlTypes.variableDefinition(
                    gqlTypes.variable(gqlTypes.name(arg.name)),
                    getGqlType(arg.type)
                ),
            ];
        }, []);
  
    return args;
  };
  