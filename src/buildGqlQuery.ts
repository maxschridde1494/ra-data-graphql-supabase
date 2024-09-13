import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    // DELETE,
    // DELETE_MANY,
    // UPDATE_MANY,
  } from 'ra-core';
  import {
    QUERY_TYPES,
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
    resourceFields: readonly IntrospectionField[],
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
        let { orderBy, ...metaVariables } = variables;
  
        const apolloArgs = buildApolloArgs(queryType, variables);
        const args = buildArgs(queryType, variables);
  
        const sparseFields = metaVariables.meta?.sparseFields;
        if (sparseFields) delete metaVariables.meta.sparseFields;
  
        // const metaArgs = buildArgs(queryType, metaVariables);

        const fields = buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields,
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
                        // gqlTypes.field(
                        //     gqlTypes.name(`_${queryType.name}Meta`),
                        //     gqlTypes.name('total'),
                        //     metaArgs,
                        //     null,
                        //     gqlTypes.selectionSet([
                        //         gqlTypes.field(gqlTypes.name('count')),
                        //     ])
                        // ),
                    ]),
                    gqlTypes.name(queryType.name),
                    apolloArgs
                ),
            ]);
        }
  
        // if (raFetchMethod === DELETE) {
        //     return gqlTypes.document([
        //         gqlTypes.operationDefinition(
        //             'mutation',
        //             gqlTypes.selectionSet([
        //                 gqlTypes.field(
        //                     gqlTypes.name(queryType.name),
        //                     gqlTypes.name('data'),
        //                     args,
        //                     null,
        //                     gqlTypes.selectionSet(fields)
        //                 ),
        //             ]),
        //             gqlTypes.name(queryType.name),
        //             apolloArgs
        //         ),
        //     ]);
        // }
  
        // if (raFetchMethod === DELETE_MANY || raFetchMethod === UPDATE_MANY) {
        //     return gqlTypes.document([
        //         gqlTypes.operationDefinition(
        //             'mutation',
        //             gqlTypes.selectionSet([
        //                 gqlTypes.field(
        //                     gqlTypes.name(queryType.name),
        //                     gqlTypes.name('data'),
        //                     args,
        //                     null,
        //                     gqlTypes.selectionSet([
        //                         gqlTypes.field(gqlTypes.name('ids')),
        //                     ])
        //                 ),
        //             ]),
        //             gqlTypes.name(queryType.name),
        //             apolloArgs
        //         ),
        //     ]);
        // }
  
        return gqlTypes.document([
            gqlTypes.operationDefinition(
                QUERY_TYPES.includes(raFetchMethod) ? 'query' : 'mutation',
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
    fields: readonly IntrospectionField[], 
}) => {
    if (!(resourceObject || typeObject)) return { object: null, fields: fields }

    const type = resourceObject?.type || typeObject as IntrospectionObjectType | IntrospectionType // as IntrospectionObjectType

    if (!type.name.endsWith('Connection')) return { object: resourceObject || typeObject, fields }

    const object = resourceObject ? 
                        introspectionResults.resources.find(r => r.type.name === type.name.replace('Connection', '')) as IntrospectedResource
                        : introspectionResults.types.find(t => t.name === type.name.replace('Connection', '')) as IntrospectionType

    return { object, fields: resourceObject ? (object as IntrospectedResource).type.fields : (object as IntrospectionObjectType).fields }
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
        fieldsProp: readonly IntrospectionField[],
        sparseFields?: SparseField[] 
    }): any => {  
        let { fields } = fieldsForObject({ introspectionResults, resourceObject, typeObject, fields: fieldsProp })
  
        const { resourceFields, linkedSparseFields } = sparseFields
            ? processSparseFields(fields, sparseFields)
            : { resourceFields: fields, linkedSparseFields: [] };
  
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
                    fields: linkedResourceObject.type.fields 
                })

                const linkedResource = object as IntrospectedResource
              
                const linkedResourceSparseFields = linkedSparseFields.find(
                    lSP => lSP.linkedType === field.name
                )?.fields || ['id']; // default to id if no sparse fields specified for linked resource
                
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
                    fields: linkedTypeObject?.fields 
                })
    
                const linkedType = object as IntrospectionType
    
                if (linkedType && !paths.includes(linkedType.name)) {
                    const possibleTypes =
                        (linkedType as IntrospectionUnionType).possibleTypes || [];
                    
                    const linkedTypeSparseFields = linkedSparseFields.find(
                        lSP => lSP.linkedType === field.name
                    )?.fields || ['id']; // default to id if no sparse fields specified for linked type
                    
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
                            fieldsProp: (linkedType as IntrospectionObjectType).fields
                        })
                    ),
                    gqlTypes.namedType(gqlTypes.name(type.name))
                ),
            ];
        }, []);
  
export const buildArgs = (
    query: IntrospectionField,
    variables: any
): ArgumentNode[] => {
    if (query.args.length === 0) {
        return [];
    }
  
    const validVariables = Object.keys(variables).filter(
      k => typeof variables[k] !== 'undefined'
    )
  
    // map RA arg fields to supabase gql query args TODO:
    // 'first',
    // 'last',
    // 'before',
    // 'after',
    // 'offset',
  
    const { sortField, sortOrder, page, perPage } = variables
    if (sortField && sortOrder) validVariables.push('orderBy')
    if (page && perPage) {
      validVariables.push('offset')
      validVariables.push('first')
    }
  
    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce(
            (acc: any, arg) => [
              ...acc,
              gqlTypes.argument(
                  gqlTypes.name(arg.name),
                  gqlTypes.variable(gqlTypes.name(arg.name))
              ),
            ],
            []
        );
  
    return args;
  };
  
export const buildApolloArgs = (
    query: IntrospectionField,
    variables: any
): VariableDefinitionNode[] => {
    if (query.args.length === 0) {
        return [];
    }
  
    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );
  
    // map RA arg fields to supabase gql query args TODO:
    // 'first',
    // 'last',
    // 'before',
    // 'after',
    // 'offset',
    const { sortField, sortOrder, page, perPage } = variables
    if (sortField && sortOrder) validVariables.push('orderBy')
    if (page && perPage) {
      validVariables.push('offset')
      validVariables.push('first')
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
  