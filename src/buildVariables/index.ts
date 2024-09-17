/* eslint-disable default-case */
import { IntrospectionField } from 'graphql';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
} from 'ra-core';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';

import { prepareParams } from './prepareParams';
import { buildGetListVariables } from './buildGetListVariables';
import { buildCreateUpdateVariables } from './buildCreateUpdateVariables';

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
            case CREATE:
            case UPDATE_MANY:
            case UPDATE: {
                return buildCreateUpdateVariables(introspectionResults)(
                    resource,
                    raFetchMethod,
                    queryType,
                    preparedParams
                );
            }
            case DELETE_MANY:
            case DELETE:
                return {
                    filter: {
                        id:
                            raFetchMethod === DELETE
                                ? { eq: preparedParams.id }
                                : { in: preparedParams.ids },
                    },
                    atMost:
                        raFetchMethod === DELETE
                            ? 1
                            : preparedParams.ids.length,
                    ...(preparedParams.meta
                        ? { meta: preparedParams.meta }
                        : {}),
                };
        }
    };
