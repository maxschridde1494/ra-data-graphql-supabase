import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
    UPDATE_MANY,
} from 'ra-core';

import buildVariables from '../src/buildVariables';
import { mockTestData } from './mockTestData';

describe('buildVariables', () => {
    describe('GET_LIST', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { GET_LIST: queryType },
                params: {
                    GET_LIST: { filtered: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_LIST,
                    params,
                    queryType
                )
            ).toEqual({
                filter: {
                    id: { in: ['foo1', 'foo2'] },
                    linkedTypesId: { in: ['tag1', 'tag2'] },
                },
                first: 10,
                offset: 90,
                orderBy: [{ sortField: 'DescNullsLast' }],
            });
        });

        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { GET_LIST: queryType },
                params: {
                    GET_LIST: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_LIST,
                    params,
                    queryType
                )
            ).toEqual({
                filter: {},
                meta: params.meta,
            });
        });
    });

    describe('CREATE', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { CREATE: queryType },
                params: {
                    CREATE: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                objects: [
                    {
                        address: params.data.address,
                        linkedType_id: params.data.linkedType_id,
                    },
                ],
            });
        });
        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { CREATE: queryType },
                params: {
                    CREATE: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                objects: [
                    {
                        address: params.data.address,
                        linkedType_id: params.data.linkedType_id,
                    },
                ],
                meta: params.data.meta,
            });
        });
    });

    describe('UPDATE', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { UPDATE: queryType },
                params: {
                    UPDATE: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { eq: params.id } },
                atMost: 1,
                set: {
                    address: params.data.address,
                },
            });
        });

        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { UPDATE: queryType },
                params: {
                    UPDATE: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { eq: params.id } },
                atMost: 1,
                set: {
                    address: params.data.address,
                },
                meta: params.meta,
            });
        });
    });

    describe('GET_MANY', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { GET_MANY: queryType },
                params: {
                    GET_MANY: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_MANY,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { in: params.ids } },
            });
        });

        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { GET_MANY: queryType },
                params: {
                    GET_MANY: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_MANY,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { in: params.ids } },
                meta: params.meta,
            });
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { GET_MANY_REFERENCE: queryType },
                params: {
                    GET_MANY_REFERENCE: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_MANY_REFERENCE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { [params.target]: { eq: params.id } },
                offset: 0,
                first: 10,
                orderBy: [{ [params.sort.field]: 'AscNullsLast' }],
            });
        });

        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { GET_MANY_REFERENCE: queryType },
                params: {
                    GET_MANY_REFERENCE: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    GET_MANY_REFERENCE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { [params.target]: { eq: params.id } },
                offset: 0,
                first: 10,
                orderBy: [{ [params.sort.field]: 'AscNullsLast' }],
                meta: params.meta,
            });
        });
    });

    describe('DELETE', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { DELETE: queryType },
                params: {
                    DELETE: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    DELETE,
                    params,
                    queryType
                )
            ).toEqual({
                atMost: 1,
                filter: { id: { eq: params.id } },
            });
        });

        it('should return correct meta', () => {
            const {
                introspectionResults,
                queryTypes: { DELETE: queryType },
                params: {
                    DELETE: { sparse: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    DELETE,
                    params,
                    queryType
                )
            ).toEqual({
                atMost: 1,
                filter: { id: { eq: params.id } },
                meta: { sparseFields: params.meta.sparseFields },
            });
        });
    });

    describe('DELETE_MANY', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { DELETE_MANY: queryType },
                params: {
                    DELETE_MANY: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    DELETE_MANY,
                    params,
                    queryType
                )
            ).toEqual({
                atMost: params.ids.length,
                filter: { id: { in: params.ids } },
            });
        });
    });

    describe('UPDATE_MANY', () => {
        it('returns correct variables', () => {
            const {
                introspectionResults,
                queryTypes: { UPDATE_MANY: queryType },
                params: {
                    UPDATE_MANY: { default: params },
                },
                resources: { default: resource },
            } = mockTestData();

            expect(
                buildVariables(introspectionResults)(
                    resource,
                    UPDATE_MANY,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { in: params.ids } },
                atMost: params.ids.length,
                set: {
                    address: params.data.address,
                },
            });
        });
    });
});
