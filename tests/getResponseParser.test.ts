import { TypeKind } from 'graphql';
import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    // CREATE,
    // UPDATE,
    // DELETE,
    // DELETE_MANY,
    // UPDATE_MANY,
} from 'ra-core';
import getResponseParser from '../src/getResponseParser';

describe('getResponseParser', () => {
    it.each([[GET_LIST], [GET_MANY], [GET_MANY_REFERENCE]])(
        'returns the response expected for %s',
        type => {
            const introspectionResults = {
                resources: [
                    {
                        type: {
                            name: 'User',
                            fields: [
                                { name: 'nodeId', type: { kind: TypeKind.SCALAR } },
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'firstName',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                    {
                        type: {
                            name: 'Tag',
                            fields: [
                                { name: 'nodeId', type: { kind: TypeKind.SCALAR } },
                                { name: 'id', type: { kind: TypeKind.SCALAR } },
                                {
                                    name: 'name',
                                    type: { kind: TypeKind.SCALAR },
                                },
                            ],
                        },
                    },
                ],
                types: [{ name: 'User' }, { name: 'Tag' }],
            };
            const response = {
                data: {
                    items: {
                        totalCount: 100,
                        edges: [
                            { 
                                node: {
                                    _typeName: 'Post',
                                    nodeId: 'post1NodeId',
                                    id: 'post1',
                                    title: 'title1',
                                    author: { id: 'author1', firstName: 'Toto' },
                                    coauthor: null,
                                    tags: [
                                        { id: 'tag1', nodeId: 'tag1NodeId', name: 'tag1 name' },
                                        { id: 'tag2', nodeId: 'tag2NodeId', name: 'tag2 name' },
                                    ],
                                    embeddedJson: { foo: 'bar' },
                                }
                            },
                            {
                                node: {
                                    _typeName: 'Post',
                                    nodeId: 'post2NodeId',
                                    id: 'post2',
                                    title: 'title2',
                                    author: { id: 'author1', firstName: 'Toto' },
                                    coauthor: null,
                                    tags: [
                                        { id: 'tag1', nodeId: 'tag1NodeId', name: 'tag1 name' },
                                        { id: 'tag3', nodeId: 'tag3NodeId', name: 'tag3 name' },
                                    ],
                                    embeddedJson: { foo: 'bar' },
                                }
                            },
                        ]
                    },
                },
            };

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    undefined,
                    undefined
                )(response)
            ).toEqual({
                data: [
                    {
                        nodeId: 'post1NodeId',
                        id: 'post1',
                        title: 'title1',
                        'author.id': 'author1',
                        author: { id: 'author1', firstName: 'Toto' },
                        tags: [
                            { nodeId: 'tag1NodeId', id: 'tag1', name: 'tag1 name' },
                            { nodeId: 'tag2NodeId', id: 'tag2', name: 'tag2 name' },
                        ],
                        tagsIds: ['tag1', 'tag2'],
                        embeddedJson: { foo: 'bar' },
                    },
                    {
                        nodeId: 'post2NodeId',
                        id: 'post2',
                        title: 'title2',
                        'author.id': 'author1',
                        author: { id: 'author1', firstName: 'Toto' },
                        tags: [
                            { nodeId: 'tag1NodeId', id: 'tag1', name: 'tag1 name' },
                            { nodeId: 'tag3NodeId', id: 'tag3', name: 'tag3 name' },
                        ],
                        tagsIds: ['tag1', 'tag3'],
                        embeddedJson: { foo: 'bar' },
                    },
                ],
                total: 100,
            });
        }
    );

    // describe.each([[CREATE], [UPDATE], [DELETE]])('%s', type => {
    //     it(`returns the response expected for ${type}`, () => {
    //         const introspectionResults = {
    //             resources: [
    //                 {
    //                     type: {
    //                         name: 'User',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'firstName',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     type: {
    //                         name: 'Tag',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'name',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             ],
    //             types: [{ name: 'User' }, { name: 'Tag' }],
    //         };
    //         const response = {
    //             data: {
    //                 data: {
    //                     _typeName: 'Post',
    //                     id: 'post1',
    //                     title: 'title1',
    //                     author: { id: 'author1', firstName: 'Toto' },
    //                     coauthor: null,
    //                     tags: [
    //                         { id: 'tag1', name: 'tag1 name' },
    //                         { id: 'tag2', name: 'tag2 name' },
    //                     ],
    //                     embeddedJson: { foo: 'bar' },
    //                 },
    //             },
    //         };
    //         expect(
    //             getResponseParser(introspectionResults)(
    //                 type,
    //                 undefined,
    //                 undefined
    //             )(response)
    //         ).toEqual({
    //             data: {
    //                 id: 'post1',
    //                 title: 'title1',
    //                 'author.id': 'author1',
    //                 author: { id: 'author1', firstName: 'Toto' },
    //                 tags: [
    //                     { id: 'tag1', name: 'tag1 name' },
    //                     { id: 'tag2', name: 'tag2 name' },
    //                 ],
    //                 tagsIds: ['tag1', 'tag2'],
    //                 embeddedJson: { foo: 'bar' },
    //             },
    //         });
    //     });

    //     it(`returns the response expected for ${type} with simple arrays of values`, () => {
    //         const introspectionResults = {
    //             resources: [
    //                 {
    //                     type: {
    //                         name: 'User',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'firstName',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     type: {
    //                         name: 'Tag',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'name',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             ],
    //             types: [{ name: 'User' }, { name: 'Tag' }],
    //         };
    //         const response = {
    //             data: {
    //                 data: {
    //                     _typeName: 'Post',
    //                     id: 'post1',
    //                     title: 'title1',
    //                     author: { id: 'author1', firstName: 'Toto' },
    //                     coauthor: null,
    //                     tags: [
    //                         { id: 'tag1', name: 'tag1 name' },
    //                         { id: 'tag2', name: 'tag2 name' },
    //                     ],
    //                     features: ['feature1', 'feature2'],
    //                     embeddedJson: { foo: 'bar' },
    //                 },
    //             },
    //         };
    //         expect(
    //             getResponseParser(introspectionResults)(
    //                 type,
    //                 undefined,
    //                 undefined
    //             )(response)
    //         ).toEqual({
    //             data: {
    //                 id: 'post1',
    //                 title: 'title1',
    //                 'author.id': 'author1',
    //                 author: { id: 'author1', firstName: 'Toto' },
    //                 tags: [
    //                     { id: 'tag1', name: 'tag1 name' },
    //                     { id: 'tag2', name: 'tag2 name' },
    //                 ],
    //                 features: ['feature1', 'feature2'],
    //                 tagsIds: ['tag1', 'tag2'],
    //                 embeddedJson: { foo: 'bar' },
    //             },
    //         });
    //     });

    //     it(`returns the response expected for ${type} with aliases`, () => {
    //         const introspectionResults = {
    //             resources: [
    //                 {
    //                     type: {
    //                         name: 'User',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'firstName',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     type: {
    //                         name: 'Tag',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'name',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             ],
    //             types: [{ name: 'User' }, { name: 'Tag' }],
    //         };
    //         const response = {
    //             data: {
    //                 data: {
    //                     _typeName: 'Post',
    //                     id: 'post1',
    //                     aliasTitle: 'title1',
    //                     author: { id: 'author1', firstName: 'Toto' },
    //                     coauthor: null,
    //                     tags: [
    //                         { id: 'tag1', name: 'tag1 name' },
    //                         { id: 'tag2', name: 'tag2 name' },
    //                     ],
    //                     embeddedJson: { foo: 'bar' },
    //                 },
    //             },
    //         };

    //         expect(
    //             getResponseParser(introspectionResults)(
    //                 type,
    //                 undefined,
    //                 undefined
    //             )(response)
    //         ).toEqual({
    //             data: {
    //                 aliasTitle: 'title1',
    //                 author: { firstName: 'Toto', id: 'author1' },
    //                 'author.id': 'author1',
    //                 coauthor: undefined,
    //                 'coauthor.id': undefined,
    //                 embeddedJson: { foo: 'bar' },
    //                 id: 'post1',
    //                 tags: [
    //                     { id: 'tag1', name: 'tag1 name' },
    //                     { id: 'tag2', name: 'tag2 name' },
    //                 ],
    //                 tagsIds: ['tag1', 'tag2'],
    //             },
    //         });
    //     });

    //     it(`returns the response expected for ${type} with embedded objects`, () => {
    //         const introspectionResults = {
    //             resources: [
    //                 {
    //                     type: {
    //                         name: 'User',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'firstName',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     type: {
    //                         name: 'Tag',
    //                         fields: [
    //                             { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                             {
    //                                 name: 'name',
    //                                 type: { kind: TypeKind.SCALAR },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             ],
    //             types: [{ name: 'User' }, { name: 'Tag' }],
    //         };
    //         const response = {
    //             data: {
    //                 data: {
    //                     _typeName: 'Post',
    //                     id: 'post1',
    //                     title: 'title1',
    //                     author: { id: 'author1', firstName: 'Toto' },
    //                     coauthor: null,
    //                     tags: [
    //                         { id: 'tag1', name: 'tag1 name' },
    //                         { id: 'tag2', name: 'tag2 name' },
    //                     ],
    //                     embeddedJson: {
    //                         strictEqual: [{ var: 'k5PjloYXQhn' }, true],
    //                     },
    //                 },
    //             },
    //         };
    //         expect(
    //             getResponseParser(introspectionResults)(
    //                 type,
    //                 undefined,
    //                 undefined
    //             )(response)
    //         ).toEqual({
    //             data: {
    //                 id: 'post1',
    //                 title: 'title1',
    //                 'author.id': 'author1',
    //                 author: { id: 'author1', firstName: 'Toto' },
    //                 tags: [
    //                     { id: 'tag1', name: 'tag1 name' },
    //                     { id: 'tag2', name: 'tag2 name' },
    //                 ],
    //                 tagsIds: ['tag1', 'tag2'],
    //                 embeddedJson: {
    //                     strictEqual: [{ var: 'k5PjloYXQhn' }, true],
    //                 },
    //             },
    //         });
    //     });
    // });

    // it('returns the response expected for DELETE_MANY', () => {
    //     const introspectionResults = {
    //         resources: [
    //             {
    //                 type: {
    //                     name: 'User',
    //                     fields: [
    //                         { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                         {
    //                             name: 'firstName',
    //                             type: { kind: TypeKind.SCALAR },
    //                         },
    //                     ],
    //                 },
    //             },
    //         ],
    //         types: [{ name: 'User' }],
    //     };
    //     const response = {
    //         data: {
    //             data: {
    //                 ids: [1, 2, 3, 4],
    //             },
    //         },
    //     };

    //     expect(
    //         getResponseParser(introspectionResults)(
    //             DELETE_MANY,
    //             undefined,
    //             undefined
    //         )(response)
    //     ).toEqual({
    //         data: [1, 2, 3, 4],
    //     });
    // });

    // it('returns the response expected for UPDATE_MANY', () => {
    //     const introspectionResults = {
    //         resources: [
    //             {
    //                 type: {
    //                     name: 'User',
    //                     fields: [
    //                         { name: 'id', type: { kind: TypeKind.SCALAR } },
    //                         {
    //                             name: 'firstName',
    //                             type: { kind: TypeKind.SCALAR },
    //                         },
    //                     ],
    //                 },
    //             },
    //         ],
    //         types: [{ name: 'User' }],
    //     };
    //     const response = {
    //         data: {
    //             data: {
    //                 ids: [1, 2, 3, 4],
    //             },
    //         },
    //     };

    //     expect(
    //         getResponseParser(introspectionResults)(
    //             UPDATE_MANY,
    //             undefined,
    //             undefined
    //         )(response)
    //     ).toEqual({
    //         data: [1, 2, 3, 4],
    //     });
    // });
});
