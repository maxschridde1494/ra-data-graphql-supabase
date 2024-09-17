/* eslint-disable default-case */
import { IntrospectionField, IntrospectionType } from 'graphql';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';

import getFinalType from '../getFinalType';
import isList from '../helpers/isList';
import { sanitizeValue } from './sanitizeValue';

export const buildGetListVariables =
    (_introspectionResults: IntrospectionResult) =>
    (resource: IntrospectedResource, _raFetchMethod: string, params: any) => {
        let variables: Partial<{
            filter: { [key: string]: any };
            offset: number;
            first: number;
            orderBy: { [key: string]: string }[];
            meta?: object;
        }> = { filter: {} };
        if (params.filter) {
            variables.filter = Object.keys(params.filter).reduce(
                (acc: any, key) => {
                    if (key.endsWith('ids')) {
                        return {
                            ...acc,
                            [key.replace('ids', 'id')]: {
                                in: params.filter[key],
                            },
                        };
                    }

                    if (
                        key.endsWith('_id') &&
                        typeof params.filter[key] === 'string'
                    ) {
                        return { ...acc, [key]: { eq: params.filter[key] } };
                    }

                    const resourceField = resource.type.fields.find(
                        f => f.name === key
                    );

                    if (resourceField) {
                        const type = getFinalType(
                            resourceField.type
                        ) as IntrospectionType;
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

                        let value = params.filter[key];

                        if (resourceField)
                            sanitizeValue(
                                getFinalType(
                                    resourceField.type
                                ) as IntrospectionType,
                                params.filter[key]
                            );

                        // allow multiple operators on the same field
                        if (acc[field]) acc[field][operator] = value;
                        else acc[field] = { [operator]: value };

                        return acc;
                    }

                    return { ...acc, [key]: params.filter[key] };
                },
                {}
            );
        }

        if (params.pagination) {
            variables.first = parseInt(params.pagination.perPage, 10);
            variables.offset =
                (parseInt(params.pagination.page, 10) - 1) * variables.first;
        }

        if (params.sort) {
            variables.orderBy = [
                {
                    [params.sort.field]:
                        params.sort.order.toLowerCase() === 'asc'
                            ? 'AscNullsLast'
                            : 'DescNullsLast',
                },
            ];
        }

        if (params.meta) variables = { ...variables, meta: params.meta };

        return variables;
    };
