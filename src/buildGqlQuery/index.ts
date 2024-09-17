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
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
import { IntrospectionField } from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

import { buildFields } from './buildFields';
import { buildApolloArgs, buildArgs } from './buildArgs';

export { buildApolloArgs, buildArgs, buildFields };

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
        } else if (variables.data?.meta) {
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
                                            gqlTypes.selectionSet(fields)
                                        ),
                                    ])
                                ),
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
                                ),
                            ])
                        ),
                    ]),
                    gqlTypes.name(queryType.name),
                    apolloArgs
                ),
            ]);
        }
    };
