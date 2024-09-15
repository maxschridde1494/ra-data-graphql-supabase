import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    // DELETE_MANY,
    // UPDATE_MANY,
} from 'ra-core';
import buildVariables from '../src/buildVariables';
import { mockTestData } from './helpers/mockTestData';

describe('buildVariables', () => {
    const introspectionResult = {
        types: [
            {
                name: 'PostFilter',
                inputFields: [{ name: 'tags_some' }],
            },
        ],
    };
    describe('GET_LIST', () => {
        it('returns correct variables', () => {
            const params = {
                filter: {
                    ids: ['foo1', 'foo2'],
                    tags: { id: ['tag1', 'tag2'] },
                    'author.id': 'author1',
                    views: 100,
                },
                pagination: { page: 10, perPage: 10 },
                sort: { field: 'sortField', order: 'DESC' },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', fields: [] } },
                    GET_LIST,
                    params,
                    {}
                )
            ).toEqual({
                filter: {
                    id: { in: ['foo1', 'foo2'] },
                    tags_some: { id_in: ['tag1', 'tag2'] },
                    author: { id: 'author1' },
                    views: 100,
                },
                first: 10,
                offset: 90,
                orderBy: [{ sortField: 'DescNullsLast' }]
            });
        });

        it('should return correct meta', () => {
            const params = {
                filter: {},
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post', fields: [] } },
                    GET_LIST,
                    params,
                    {}
                )
            ).toEqual({
                filter: {},
                meta: { sparseFields: [] },
            });
        });
    });

    describe('CREATE', () => {
        it('returns correct variables', () => {
            const { 
                introspectionResults: { default: introspectionResult },
                queryTypes: { Create: queryType },
                params: { Create: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
                    resource,
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                objects: [
                    {
                        address: params.data.address,
                        linkedType_id: params.data.linkedType_id
                    }
                ]
            });
        });
        it('should return correct meta', () => {
            const { 
                introspectionResults: { default: introspectionResult },
                queryTypes: { Create: queryType },
                params: { CreateSparseFields: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
                    resource,
                    CREATE,
                    params,
                    queryType
                )
            ).toEqual({
                objects: [
                    {
                        address: params.data.address,
                        linkedType_id: params.data.linkedType_id
                    }
                ],
                meta: params.data.meta
            });
        });
    });

    describe('UPDATE', () => {
        it('returns correct variables', () => {
            const { 
                introspectionResults: { default: introspectionResult },
                queryTypes: { Update: queryType },
                params: { Update: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
                    resource,
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { eq: params.id } },
                atMost: 1,
                set: {
                    address: params.data.address
                }
            });
        });

        it('should return correct meta', () => {
            const { 
                introspectionResults: { default: introspectionResult },
                queryTypes: { Update: queryType },
                params: { UpdateSparseFields: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
                    resource,
                    UPDATE,
                    params,
                    queryType
                )
            ).toEqual({
                filter: { id: { eq: params.id } },
                atMost: 1,
                set: {
                    address: params.data.address
                },
                meta: params.meta
            });
        });
    });

    describe('GET_MANY', () => {
        it('returns correct variables', () => {
            const params = {
                ids: ['tag1', 'tag2'],
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY,
                    params,
                    {}
                )
            ).toEqual({
                filter: { id: { in: ['tag1', 'tag2'] } },
            });
        });

        it('should return correct meta', () => {
            const params = {
                ids: ['tag1', 'tag2'],
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY,
                    params,
                    {}
                )
            ).toEqual({
                filter: { id: { in: ['tag1', 'tag2'] } },
                meta: { sparseFields: [] },
            });
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns correct variables', () => {
            const params = {
                target: 'author_id',
                id: 'author1',
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'name', order: 'ASC' },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY_REFERENCE,
                    params,
                    {}
                )
            ).toEqual({
                filter: { author_id: { eq: 'author1' } },
                offset: 0,
                first: 10,
                orderBy: [{ name: 'AscNullsLast' }],
            });
        });

        it('should return correct meta', () => {
            const params = {
                target: 'author_id',
                id: 'author1',
                meta: { sparseFields: [] },
            };

            expect(
                buildVariables(introspectionResult)(
                    { type: { name: 'Post' } },
                    GET_MANY_REFERENCE,
                    params,
                    {}
                )
            ).toEqual({
                filter: { author_id: { eq: 'author1' } },
                meta: { sparseFields: [] },
            });
        });
    });

    describe('DELETE', () => {
        it('returns correct variables', () => {
            const { 
                introspectionResults: { default: introspectionResult },
                queryTypes: { Delete: queryType },
                params: { Delete: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
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
                introspectionResults: { default: introspectionResult },
                queryTypes: { Delete: queryType },
                params: { DeleteSparseFields: params },
                resources: { default: { resource } }
            } = mockTestData()

            expect(
                buildVariables(introspectionResult)(
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

    // describe('DELETE_MANY', () => {
    //     it('returns correct variables', () => {
    //         const params = {
    //             ids: ['post1'],
    //         };
    //         expect(
    //             buildVariables(introspectionResult)(
    //                 { type: { name: 'Post', inputFields: [] } },
    //                 DELETE_MANY,
    //                 params,
    //                 {}
    //             )
    //         ).toEqual({
    //             ids: ['post1'],
    //         });
    //     });
    // });

    // describe('UPDATE_MANY', () => {
    //     it('returns correct variables', () => {
    //         const params = {
    //             ids: ['post1', 'post2'],
    //             data: {
    //                 title: 'New Title',
    //             },
    //         };
    //         expect(
    //             buildVariables(introspectionResult)(
    //                 { type: { name: 'Post', inputFields: [] } },
    //                 UPDATE_MANY,
    //                 params,
    //                 {}
    //             )
    //         ).toEqual({
    //             ids: ['post1', 'post2'],
    //             data: {
    //                 title: 'New Title',
    //             },
    //         });
    //     });
    // });
});
