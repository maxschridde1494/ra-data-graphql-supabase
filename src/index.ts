import merge from 'lodash/merge';
import buildDataProvider, {
    BuildQueryFactory,
    Options,
    defaultOptions as baseDefaultOptions,
} from 'ra-data-graphql';
import { DELETE_MANY, DataProvider, Identifier, UPDATE_MANY } from 'ra-core';

import defaultBuildQuery from './buildQuery';
import {
    CREATE,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    DELETE,
} from 'react-admin';

export const buildQuery = defaultBuildQuery;
export { buildQueryFactory } from './buildQuery';
export { default as buildGqlQuery } from './buildGqlQuery';
export { default as buildVariables } from './buildVariables';
export { default as getResponseParser } from './getResponseParser';

const introspection = {
    operationNames: {
        [GET_LIST]: (resource: { name: string }) =>
            `${resource.name}Collection`,
        [GET_MANY]: (resource: { name: string }) =>
            `${resource.name}Collection`,
        [GET_MANY_REFERENCE]: (resource: { name: string }) =>
            `${resource.name}Collection`,
        [GET_ONE]: (resource: { name: string }) => `${resource.name}ById`,
        [CREATE]: (resource: { name: string }) =>
            `insertInto${resource.name}Collection`,
        [UPDATE]: (resource: { name: string }) =>
            `update${resource.name}Collection`,
        [DELETE]: (resource: { name: string }) =>
            `deleteFrom${resource.name}Collection`,
    },
    exclude: undefined,
    include: undefined,
};

export { introspection as defaultIntrospection };

const defaultOptions = {
    ...baseDefaultOptions,
    introspection,
    buildQuery: defaultBuildQuery,
};

const bulkActionOperationNames = {
    [DELETE_MANY]: (resource: { name: string }) =>
        `deleteFrom${resource.name}Collection`,
    [UPDATE_MANY]: (resource: { name: string }) =>
        `update${resource.name}Collection`,
};

export default (
    options: Omit<Options, 'buildQuery'> & {
        buildQuery?: BuildQueryFactory;
        bulkActionsEnabled?: boolean;
    }
): DataProvider => {
    const { bulkActionsEnabled = false, ...dPOptions } = merge(
        {},
        defaultOptions,
        options
    );

    if (bulkActionsEnabled && dPOptions.introspection?.operationNames)
        dPOptions.introspection.operationNames = merge(
            dPOptions.introspection.operationNames,
            bulkActionOperationNames
        );

    const defaultDataProvider = buildDataProvider(dPOptions);

    return {
        ...defaultDataProvider,
        // This provider defaults to sending multiple DELETE requests for DELETE_MANY
        // and multiple UPDATE requests for UPDATE_MANY unless bulk actions are enabled
        // This can be optimized using the apollo-link-batch-http link
        ...(bulkActionsEnabled
            ? {}
            : {
                  deleteMany: (resource, params) => {
                      const { ids, ...otherParams } = params;
                      return Promise.all(
                          ids.map(id =>
                              defaultDataProvider.delete(resource, {
                                  id,
                                  previousData: null,
                                  ...otherParams,
                              })
                          )
                      ).then(results => {
                          const data = results.reduce<Identifier[]>(
                              (acc, { data }) => [...acc, data.id],
                              []
                          );

                          return { data };
                      });
                  },
                  updateMany: (resource, params) => {
                      const { ids, data, ...otherParams } = params;
                      return Promise.all(
                          ids.map(id =>
                              defaultDataProvider.update(resource, {
                                  id,
                                  data: data,
                                  previousData: null,
                                  ...otherParams,
                              })
                          )
                      ).then(results => {
                          const data = results.reduce<Identifier[]>(
                              (acc, { data }) => [...acc, data.id],
                              []
                          );

                          return { data };
                      });
                  },
              }),
    };
};
