/* eslint-disable default-case */
import {
    IntrospectionField,
    IntrospectionInputObjectType,
    IntrospectionNamedTypeRef,
    IntrospectionNonNullTypeRef,
    IntrospectionType,
    TypeKind,
} from 'graphql';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    // DELETE,
    // DELETE_MANY,
    // UPDATE_MANY,
} from 'ra-core';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
  
import getFinalType from './getFinalType';
import isList from './isList';
  
export default (introspectionResults: IntrospectionResult) =>
(
    resource: IntrospectedResource,
    raFetchMethod: string,
    params: any,
    queryType: IntrospectionField
) => {
    const preparedParams = prepareParams(
        params,
        queryType,
        introspectionResults
    );

    switch (raFetchMethod) {
        case GET_LIST: {
            return buildGetListVariables(introspectionResults)(
                resource,
                raFetchMethod,
                preparedParams
            );
        }
        case GET_MANY:
            return {
                filter: { id: { in: preparedParams.ids } },
                ...(preparedParams.meta
                    ? { meta: preparedParams.meta }
                    : {}),
            };
        case GET_MANY_REFERENCE: {
            let variables = buildGetListVariables(introspectionResults)(
                resource,
                raFetchMethod,
                preparedParams
            );

            variables.filter = {
                ...variables.filter,
                [preparedParams.target]: { eq: preparedParams.id },
            };

            return variables;
        }
        case GET_ONE:
            return {
                id: preparedParams.id,
                ...(preparedParams.meta
                    ? { meta: preparedParams.meta }
                    : {}),
                };
        // case DELETE:
        //     return {
        //         id: preparedParams.id,
        //         ...(preparedParams.meta
        //             ? { meta: preparedParams.meta }
        //             : {}),
        //         };
        // case DELETE_MANY:
        //     return preparedParams;
        case CREATE:
        case UPDATE: {
            return buildCreateUpdateVariables(introspectionResults)(
                resource,
                raFetchMethod,
                queryType,
                preparedParams
            );
        }
        // case UPDATE_MANY: {
        //     const { ids, data: resourceData } = preparedParams;
        //     const { id, ...data } = buildCreateUpdateVariables(
        //         resource,
        //         raFetchMethod,
        //         { data: resourceData },
        //         queryType
        //     );
        //     return {
        //         ids,
        //         data,
        //     };
        // }
    }
};
  
const sanitizeValue = (type: IntrospectionType, value: any) => {
    if (type.name === 'Int') {
        return parseInt(value, 10);
    }

    if (type.name === 'Float') {
        return parseFloat(value);
    }

    return value;
};
  
const castType = (
    value: any,
    type: IntrospectionType | IntrospectionNonNullTypeRef
) => {
    const realType = type.kind === 'NON_NULL' ? type.ofType : type;
    switch (
        `${realType.kind}:${(realType as IntrospectionNamedTypeRef).name}`
    ) {
        case 'SCALAR:Int':
            return Number(value);

        case 'SCALAR:String':
            return String(value);

        case 'SCALAR:Boolean':
            return Boolean(value);

        default:
            return value;
    }
};
  
const prepareParams = (
    params: any,
    queryType: Partial<IntrospectionField>,
    introspectionResults: IntrospectionResult
) => {
    const result: {[key: string]: any } = {};

    if (!params) {
        return params;
    }

    Object.keys(params).forEach(key => {
        const param = params[key];
        let arg = null;

        if (!param) {
            result[key] = param;
            return;
        }

        if (queryType && Array.isArray(queryType.args)) {
            arg = queryType.args.find(item => item.name === key);
        }

        if (param instanceof File) {
            result[key] = param;
            return;
        }

        if (param instanceof Date) {
            result[key] = param.toISOString();
            return;
        }

        if (
            param instanceof Object &&
            !Array.isArray(param) &&
            arg &&
            arg.type.kind === 'INPUT_OBJECT'
        ) {
            const args = (
                introspectionResults.types.find(
                    item =>
                        item.kind === arg.type.kind &&
                        item.name === arg.type.name
                ) as IntrospectionInputObjectType
            ).inputFields;
            result[key] = prepareParams(param, { args }, introspectionResults);
            return;
        }

        if (
            param instanceof Object &&
            !(param instanceof Date) &&
            !Array.isArray(param)
        ) {
            result[key] = prepareParams(param, queryType, introspectionResults);
            return;
        }

        if (!arg) {
            result[key] = param;
            return;
        }

        result[key] = castType(param, arg.type);
    });

    return result;
};
  
const buildGetListVariables = (introspectionResults: IntrospectionResult) =>
    (resource: IntrospectedResource, _raFetchMethod: string, params: any) => {
        let variables: Partial<{
            filter: { [key: string]: any };
            offset: number;
            first: number;
            orderBy: {[key: string]: string}[];
            meta?: object;
        }> = { filter: {} };
        if (params.filter) {
            variables.filter = Object.keys(params.filter).reduce((acc: any, key) => {
                if (key.endsWith('ids')) {
                    return { ...acc, [key.replace('ids', 'id')]: { in: params.filter[key] } };
                }

                if (key.endsWith('_id') && typeof params.filter[key] === 'string') {
                    return { ...acc, [key]: { eq: params.filter[key] } };
                }

                if (typeof params.filter[key] === 'object') {
                    const type = introspectionResults.types.find(
                        t => t.name === `${resource.type.name}Filter`
                    );
                    const filterSome = (
                        type as IntrospectionInputObjectType
                    )?.inputFields?.find(t => t.name === `${key}_some`);

                    if (filterSome) {
                        const filter = Object.keys(params.filter[key]).reduce(
                            (acc, k) => ({
                                ...acc,
                                [`${k}_in`]: params.filter[key][k],
                            }),
                            {}
                        );
                        return { ...acc, [`${key}_some`]: filter };
                    }
                }

                const parts = key.split('.');

                if (parts.length > 1) {
                    if (parts[1] === 'id') {
                        const type = introspectionResults.types.find(
                            t => t.name === `${resource.type.name}Filter`
                        );
                        const filterSome = (
                            type as IntrospectionInputObjectType
                        )?.inputFields?.find(
                            t => t.name === `${parts[0]}_some`
                        );

                        if (filterSome) {
                            return {
                                ...acc,
                                [`${parts[0]}_some`]: {
                                    id: params.filter[key],
                                },
                            };
                        }

                        return {
                            ...acc,
                            [parts[0]]: { id: params.filter[key] },
                        };
                    }

                    const resourceField = resource.type.fields.find(
                        f => f.name === parts[0]
                    ) as IntrospectionField;
                    const type = getFinalType(resourceField.type)  as IntrospectionType;
                    return {
                        ...acc,
                        [key]: sanitizeValue(type, params.filter[key]),
                    };
                }

                const resourceField = resource.type.fields.find(
                    f => f.name === key
                );

                if (resourceField) {
                    const type = getFinalType(resourceField.type) as IntrospectionType;
                    const isAList = isList(resourceField.type);

                    if (isAList) {
                        return {
                            ...acc,
                            [key]: Array.isArray(params.filter[key])
                                ? params.filter[key].map(value =>
                                        sanitizeValue(type, value)
                                    )
                                : sanitizeValue(type, [params.filter[key]]),
                        };
                    }

                    return {
                        ...acc,
                        [key]: sanitizeValue(type, params.filter[key]),
                    };
                }

                if (key.includes('_op_')) {
                    const field = key.split('_op_')[0];
                    const operator = key.split('_op_')[1];

                    const resourceField = resource.type.fields.find(
                    f => f.name === field
                    ) as IntrospectionField;

                    let value = params.filter[key]

                    if (resourceField) sanitizeValue(getFinalType(resourceField.type) as IntrospectionType, params.filter[key]);
                    
                    // allow multiple operators on the same field
                    if (acc[field]) acc[field][operator] = value;
                    else acc[field] = { [operator]: value };

                    return acc
                }

                return { ...acc, [key]: params.filter[key] };
            }, {});
        }

        if (params.pagination) {
            variables.first = parseInt(params.pagination.perPage, 10);
            variables.offset = (parseInt(params.pagination.page, 10) - 1) * variables.first;
        }

        if (params.sort) {
            variables.orderBy = [{ [params.sort.field]: params.sort.order.toLowerCase() === 'asc' ? 'AscNullsLast' : 'DescNullsLast' }];
        }

        if (params.meta) variables = { ...variables, meta: params.meta };

        return variables;
    };

const buildCreateUpdateVariables = (introspectionResults: IntrospectionResult) => (
    _resource: IntrospectedResource,
    raFetchMethod: string,
    queryType: IntrospectionField,
    args: any,
) => {
    let { id, data, meta } = args;
    if (!meta && data.meta) {
        meta = data.meta;
        delete data.meta;
    }
    let variables: any = { meta };
    let dataType: { key: 'objects' | 'set', type: TypeKind.LIST | TypeKind.OBJECT }
    let inputType: IntrospectionInputObjectType;

    if (raFetchMethod === UPDATE) {
        dataType = { key: 'set', type: TypeKind.OBJECT };
        const updateInputTypeName = (queryType.args.find(a => a.name === dataType.key).type as any).ofType.name
        inputType = introspectionResults.types.find(t => t.name === updateInputTypeName) as IntrospectionInputObjectType;
        variables.filter = { id: { eq: id } }
        variables.atMost = 1
    } else {
        dataType = { key: 'objects', type: TypeKind.LIST };
        const instertInputTypeName = (queryType.args.find(a => a.name === dataType.key).type as any).ofType.ofType.ofType.name // list type so doubly nested ofTypes
        inputType = introspectionResults.types.find(t => t.name === instertInputTypeName) as IntrospectionInputObjectType;
    }

    const sanitizedData = Object.keys(data).reduce(
        (acc, key) => {
            if (!inputType.inputFields.find(f => f.name === key)) {
                console.info(`Field ${key} is not available on type ${inputType.name}`);
                return acc;
            }
            if (Array.isArray(data[key])) {
                const arg = queryType.args.find(a => a.name === `${key}Ids`);

                if (arg) {
                    return {
                        ...acc,
                        [`${key}Ids`]: data[key].map(({ id }) => id),
                    };
                }
            }

            if (typeof data[key] === 'object') {
                const arg = queryType.args.find(a => a.name === `${key}Id`);

                if (arg) {
                    return {
                        ...acc,
                        [`${key}Id`]: data[key].id,
                    };
                }
            }

            return {
                ...acc,
                [key]: data[key],
            };
        },
        {}
    )

    variables[dataType.key] = sanitizedData;
    if (dataType.type === TypeKind.LIST) variables[dataType.key] = [variables[dataType.key]];

    return variables
}
  