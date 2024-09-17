import { IntrospectionField, IntrospectionInputObjectType } from "graphql";
import { IntrospectionResult } from "ra-data-graphql";

import { castType } from '../helpers/castType';

export const prepareParams = (
    params: any,
    queryType: Partial<IntrospectionField>,
    introspectionResults: IntrospectionResult
) => {
    const result: { [key: string]: any; } = {};

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

        if (param instanceof Object &&
            !Array.isArray(param) &&
            arg &&
            arg.type.kind === 'INPUT_OBJECT') {
            const args = (
                introspectionResults.types.find(
                    item => item.kind === arg.type.kind &&
                        item.name === arg.type.name
                ) as IntrospectionInputObjectType
            ).inputFields;
            result[key] = prepareParams(param, { args }, introspectionResults);
            return;
        }

        if (param instanceof Object &&
            !(param instanceof Date) &&
            !Array.isArray(param)) {
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
