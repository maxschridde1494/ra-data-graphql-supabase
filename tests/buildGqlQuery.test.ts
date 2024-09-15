import { IntrospectionField, TypeKind, print } from 'graphql';
import { gql } from '@apollo/client';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    // CREATE,
    // DELETE,
    // DELETE_MANY,
    // UPDATE_MANY,
} from 'ra-core';

import buildGqlQuery, {
    buildApolloArgs,
    buildArgs,
    buildFields,
} from '../src/buildGqlQuery';
import { mockTestData } from './helpers/mockTestData';

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildArgs({ args: [] } as IntrospectionField, {})).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            print(
                buildArgs(
                    { args: [{ name: 'foo' }, { name: 'bar' }] } as IntrospectionField,
                    { foo: 'foo_value' }
                )
            )
        ).toEqual(['foo: $foo']);
    });
});

describe('buildApolloArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(print(buildApolloArgs({ args: [] }, {}))).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            print(
                buildApolloArgs(
                    {
                        args: [
                            {
                                name: 'foo',
                                type: {
                                    kind: TypeKind.NON_NULL,
                                    ofType: {
                                        kind: TypeKind.SCALAR,
                                        name: 'Int',
                                    },
                                },
                            },
                            {
                                name: 'barId',
                                type: { kind: TypeKind.SCALAR, name: 'ID' },
                            },
                            {
                                name: 'barIds',
                                type: {
                                    kind: TypeKind.LIST,
                                    ofType: {
                                        kind: TypeKind.NON_NULL,
                                        ofType: {
                                            kind: TypeKind.SCALAR,
                                            name: 'ID',
                                        },
                                    },
                                },
                            },
                            { name: 'bar' },
                        ],
                    },
                    { foo: 'foo_value', barId: 100, barIds: [101, 102] }
                )
            )
        ).toEqual(['$foo: Int!', '$barId: ID', '$barIds: [ID!]']);
    });
});

describe('buildFields', () => {
    it('returns an object with the fields to retrieve', () => {
        const { introspectionResults: { default: introspectionResults }, resources: { default: resource } } =
                mockTestData();

        const scalarFields = resource.type.fields //.filter(f => f.type.kind === TypeKind.SCALAR)
        const builtFields = buildFields(introspectionResults)({ 
            resourceObject: resource,
            fieldsProp: scalarFields,
        })

        expect(print(builtFields)).toEqual([
            'id',
            'address',
            'linkedType_id',
            `linkedTypes {
  totalCount
  edges {
    node {
      id
    }
  }
}`,
            'resourceType_id',
            `resourceTypes {
  id
}`,
        ]);
    });

    describe('with sparse fields', () => {
        it('returns an object with the fields to retrieve', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                resources: { default: resource }, 
                params: { SparseFields: params } 
            } = mockTestData();

            // nested sparse params
            // const params = {...SparseFields}
            params.meta.sparseFields[2].linkedTypes.push({ nestedLinks: ['id', 'bar'] });

            expect(
                print(buildFields(introspectionResults)({
                    resourceObject: resource,
                    fieldsProp: resource.type.fields,
                    sparseFields: params.meta.sparseFields
                }))
            ).toEqual([
                'id',
                'address',
                `linkedTypes {
  totalCount
  edges {
    node {
      id
      title
      nestedLinks {
        totalCount
        edges {
          node {
            id
            bar
          }
        }
      }
    }
  }
}`,
                `resourceTypes {
  id
  foo
  name
}`,
            ]);
        });

        it('throws an error when sparse fields is requested but empty', () => {
            const { 
                introspectionResults: { default: introspectionResults}, 
                resources: { default: resource } 
            } = mockTestData();

            expect(() =>
                buildFields(introspectionResults)({
                    resourceObject: resource,
                    fieldsProp: resource.type.fields,
                    sparseFields: []
                })
            ).toThrowError(
                "Empty sparse fields. Specify at least one field or remove the 'sparseFields' param"
            );
        });

        it('throws an error when requested sparse fields are not available', () => {
            const { 
                introspectionResults: { default: introspectionResults}, 
                resources: { default: resource } 
            } = mockTestData();

            expect(() =>
                buildFields(introspectionResults)({
                    resourceObject: resource,
                    fieldsProp: resource.type.fields,
                    sparseFields: ['unavailbleField']
                })
            ).toThrowError(
                "Requested sparse fields not found. Ensure sparse fields are available in the resource's type"
            );
        });
    });
});

describe('buildFieldsWithCircularDependency', () => {
    it('returns an object with the fields to retrieve', () => {
        const { 
            introspectionResults: { circularDependencies: introspectionResults }, 
            resources: { default: resource } } = mockTestData();

        expect(print(buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields,
        }))).toEqual([
            'id',
            'address',
            'linkedType_id',
            `linkedTypes {
  totalCount
  edges {
    node {
      id
    }
  }
}`,
            'resourceType_id',
            `resourceTypes {
  id
}`,
        ]);
    });
});

describe('buildFieldsWithSameType', () => {
    it('returns an object with the fields to retrieve', () => {
        const { 
            introspectionResults: { default: introspectionResults }, 
            resources: { WithMultipleFieldsOfSameType: resource } 
        } = mockTestData();

        expect(print(buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields,
        }))).toEqual([
            'id',
            'address',
            'linkedType_id',
            `linkedTypes {
  totalCount
  edges {
    node {
      id
    }
  }
}`,
            'anotherLinkedType_id',
            `anotherLinkedTypes {
  totalCount
  edges {
    node {
      id
    }
  }
}`,
            'resourceType_id',
            `resourceTypes {
  id
}`,
        ]);
    });
});

describe('buildGqlQuery', () => {
    describe('GET_LIST', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                resources: { default: resource },
                queryTypes: { GetList: queryType }, 
                params: { default: params },
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_LIST,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedType_id
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                            }
                                        }
                                    }
                                    resourceType_id
                                    resourceTypes {
                                        id
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { SparseFields: params }, 
                queryTypes: { GetList: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_LIST,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                                title
                                            }
                                        }
                                    }
                                    resourceTypes {
                                        id
                                        foo
                                        name
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('GET_MANY', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { default: params }, 
                queryTypes: { GetList: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_MANY,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedType_id
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                            }
                                        }
                                    }
                                    resourceType_id
                                    resourceTypes {
                                        id
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { SparseFields: params }, 
                queryTypes: { GetList: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_MANY,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                                title
                                            }
                                        }
                                    }
                                    resourceTypes {
                                        id
                                        foo
                                        name
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });
    });

    describe('GET_MANY_REFERENCE', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { default: params }, 
                queryTypes: { GetList: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_MANY_REFERENCE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedType_id
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                            }
                                        }
                                    }
                                    resourceType_id
                                    resourceTypes {
                                        id
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { SparseFields: params }, 
                queryTypes: { GetList: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_MANY_REFERENCE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query allCommand($foo: Int!) {
                        items: allCommand(foo: $foo) {
                            totalCount
                            edges {
                                node {
                                    id
                                    address
                                    linkedTypes {
                                        totalCount
                                        edges {
                                            node {
                                                id
                                                title
                                            }
                                        }
                                    }
                                    resourceTypes {
                                        id
                                        foo
                                        name
                                    }
                                }
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('GET_ONE', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { GetOne: params }, 
                queryTypes: { GetOne: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_ONE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query commandsById($id: ID!) {
                        data: commandsById(id: $id) {
                            id
                            address
                            linkedType_id
                            linkedTypes {
                              totalCount
                              edges {
                                node {
                                  id
                                }
                              }
                            }
                            resourceType_id
                            resourceTypes {
                              id
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { GetOneSparseFields: params }, 
                queryTypes: { GetOne: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        GET_ONE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    query commandsById($id: ID!) {
                        data: commandsById(id: $id) {
                            id
                            address
                            linkedTypes {
                              totalCount
                              edges {
                                node {
                                  id
                                  title
                                }
                              }
                            }
                            resourceTypes {
                              id
                              foo
                              name
                            }
                        }
                    }
                `)
            );
        });
    });
    describe('UPDATE', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { Update: params }, 
                queryTypes: { Update: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        UPDATE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation updatecommandsCollection($filter: commandsFilter, $set: commandsUpdateInput!, $atMost: Int!) {
                        data: updatecommandsCollection(filter: $filter, set: $set, atMost: $atMost) {
                            affectedCount
                            records {
                                id
                                address
                                linkedType_id
                                linkedTypes {
                                  totalCount
                                  edges {
                                    node {
                                      id
                                    }
                                  }
                                }
                                resourceType_id
                                resourceTypes {
                                  id
                                }
                            }
                        }
                    }
                `)
            );
        });

        it('returns the correct query with sparse fields', () => {
            const { 
                introspectionResults: { default: introspectionResults }, 
                params: { UpdateSparseFields: params }, 
                queryTypes: { Update: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        UPDATE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation updatecommandsCollection($filter: commandsFilter, $set: commandsUpdateInput!, $atMost: Int!) {
                        data: updatecommandsCollection(filter: $filter, set: $set, atMost: $atMost) {
                            affectedCount
                            records {
                                id
                                address
                                linkedTypes {
                                  totalCount
                                  edges {
                                    node {
                                      id
                                      title
                                    }
                                  }
                                }
                                resourceTypes {
                                  id
                                  foo
                                  name
                                }
                            }
                        }
                    }
                `)
            );
        });
    });
//     describe('CREATE', () => {
//         it('returns the correct query', () => {
//             expect(
//                 print(
//                     buildGqlQuery(introspectionResults)(
//                         resource,
//                         CREATE,
//                         { ...queryType, name: 'createCommand' },
//                         params
//                     )
//                 )
//             ).toEqual(
//                 print(gql`
//                     mutation createCommand($foo: Int!) {
//                         data: createCommand(foo: $foo) {
//                             foo
//                             linked {
//                                 foo
//                             }
//                             resource {
//                                 id
//                             }
//                         }
//                     }
//                 `)
//             );
//         });

//         it('returns the correct query with sparse fields', () => {
//             const { introspectionResults: { default: introspectionResults}, params, queryType, resources: { default: resource } } =
//                 mockTestData();

//             expect(
//                 print(
//                     buildGqlQuery(introspectionResults)(
//                         resource,
//                         CREATE,
//                         { ...queryType, name: 'createCommand' },
//                         params
//                     )
//                 )
//             ).toEqual(
//                 print(gql`
//                     mutation createCommand($foo: Int!) {
//                         data: createCommand(foo: $foo) {
//                             address
//                             linked {
//                                 title
//                             }
//                             resource {
//                                 foo
//                                 name
//                             }
//                         }
//                     }
//                 `)
//             );
//         });
//     });
//     describe('DELETE', () => {
//         it('returns the correct query', () => {
//             expect(
//                 print(
//                     buildGqlQuery(introspectionResults)(
//                         resource,
//                         DELETE,
//                         { ...queryType, name: 'deleteCommand' },
//                         params
//                     )
//                 )
//             ).toEqual(
//                 print(gql`
//                     mutation deleteCommand($foo: Int!) {
//                         data: deleteCommand(foo: $foo) {
//                             foo
//                             linked {
//                                 foo
//                             }
//                             resource {
//                                 id
//                             }
//                         }
//                     }
//                 `)
//             );
//         });

//         it('returns the correct query with sparse fields', () => {
//             const { introspectionResults: { default: introspectionResults}, params, queryType, resources: { default: resource } } =
//                 mockTestData();

//             expect(
//                 print(
//                     buildGqlQuery(introspectionResults)(
//                         resource,
//                         DELETE,
//                         { ...queryType, name: 'deleteCommand' },
//                         params
//                     )
//                 )
//             ).toEqual(
//                 print(gql`
//                     mutation deleteCommand($foo: Int!) {
//                         data: deleteCommand(foo: $foo) {
//                             address
//                             linked {
//                                 title
//                             }
//                             resource {
//                                 foo
//                                 name
//                             }
//                         }
//                     }
//                 `)
//             );
//         });
//     });

//     it('returns the correct query for DELETE_MANY', () => {
//         expect(
//             print(
//                 buildGqlQuery(introspectionResults)(
//                     resource,
//                     DELETE_MANY,
//                     queryTypeDeleteMany,
//                     { ids: [1, 2, 3] }
//                 )
//             )
//         ).toEqual(
//             `mutation deleteCommands($ids: [ID!]) {
//   data: deleteCommands(ids: $ids) {
//     ids
//   }
// }
// `
//         );
//     });

//     it('returns the correct query for UPDATE_MANY', () => {
//         expect(
//             print(
//                 buildGqlQuery(introspectionResults)(
//                     resource,
//                     UPDATE_MANY,
//                     queryTypeUpdateMany,
//                     {
//                         ids: [1, 2, 3],
//                         data: params,
//                     }
//                 )
//             )
//         ).toEqual(
//             `mutation updateCommands($ids: [ID!], $data: CommandType) {
//   data: updateCommands(ids: $ids, data: $data) {
//     ids
//   }
// }
// `
//         );
//     });
});
