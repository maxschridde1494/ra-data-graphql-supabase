import { print } from 'graphql';
import { gql } from '@apollo/client';
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

import buildGqlQuery, {
    buildApolloArgs,
    buildArgs,
    buildFields,
} from '../src/buildGqlQuery';
import { mockTestData, circularDependencyTypes } from './helpers/mockTestData';

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        const {
            queryTypes: { UPDATE: queryType },
            params: { UPDATE: { default: params } },
        } = mockTestData()

        queryType.args = []

        expect(buildArgs(queryType, params, 'UPDATE')).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        const {
            queryTypes: { UPDATE: queryType },
            params: { UPDATE: { default: params } },
        } = mockTestData()
        
        expect(
            print(buildArgs(queryType, params, 'UPDATE'))
        ).toEqual([
            'filter: $filter',
            'set: $set',
            'atMost: $atMost',
        ]);
    });
});

describe('buildApolloArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        const {
            queryTypes: { UPDATE: queryType },
            params: { UPDATE: { default: params } },
        } = mockTestData()

        queryType.args = []

        expect(
            print(
                buildApolloArgs(queryType, params, 'UPDATE')
            )
        ).toEqual([]);
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        const {
            queryTypes: { UPDATE: queryType },
            params: { UPDATE: { default: params } },
        } = mockTestData()

        expect(
            print(buildApolloArgs(queryType, params, 'UPDATE'))
        ).toEqual([
            '$filter: commandsFilter',
            '$set: commandsUpdateInput!',
            '$atMost: Int!',
        ]);
    });
});

describe('buildFields', () => {
    it('returns an object with the fields to retrieve', () => {
        const { introspectionResults, resources: { default: resource } } = mockTestData();

        const builtFields = buildFields(introspectionResults)({ 
            resourceObject: resource,
            fieldsProp: resource.type.fields,
        })

        expect(print(builtFields)).toEqual([
            'id',
            'address',
            'features',
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
                introspectionResults, 
                resources: { default: resource }, 
                params: { GET_LIST: { sparse: params } } 
            } = mockTestData();

            // nested sparse params
            // const params = {...sparse}
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
                introspectionResults, 
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
                introspectionResults, 
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
            introspectionResults, 
            resources: { default: resource } } = mockTestData();

        introspectionResults.types = circularDependencyTypes;

        expect(print(buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields,
        }))).toEqual([
            'id',
            'address',
            'features',
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
            introspectionResults, 
            resources: { WithMultipleFieldsOfSameType: resource } 
        } = mockTestData();

        expect(print(buildFields(introspectionResults)({
            resourceObject: resource,
            fieldsProp: resource.type.fields,
        }))).toEqual([
            'id',
            'address',
            'features',
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
                introspectionResults, 
                resources: { default: resource },
                queryTypes: { GET_LIST: queryType }, 
                params: { GET_LIST: { default: params } },
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
                                    features
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
                introspectionResults, 
                params: { GET_LIST: { sparse: params } }, 
                queryTypes: { GET_LIST: queryType }, 
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
                introspectionResults, 
                params: { GET_LIST: { default: params } }, 
                queryTypes: { GET_LIST: queryType }, 
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
                                    features
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
                introspectionResults, 
                params: { GET_LIST: { sparse: params } }, 
                queryTypes: { GET_LIST: queryType }, 
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
                introspectionResults, 
                params: { GET_LIST: { default: params } }, 
                queryTypes: { GET_LIST: queryType }, 
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
                                    features
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
                introspectionResults, 
                params: { GET_LIST: { sparse: params } }, 
                queryTypes: { GET_LIST: queryType }, 
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
                introspectionResults, 
                params: { GET_ONE: { default: params } }, 
                queryTypes: { GET_ONE: queryType }, 
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
                            features
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
                introspectionResults, 
                params: { GET_ONE: { sparse: params } }, 
                queryTypes: { GET_ONE: queryType }, 
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
                introspectionResults, 
                params: { UPDATE: { default: params } }, 
                queryTypes: { UPDATE: queryType }, 
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
                                features
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
                introspectionResults, 
                params: { UPDATE: { sparse: params } }, 
                queryTypes: { UPDATE: queryType }, 
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

    describe('CREATE', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults, 
                params: { CREATE: { default: params } }, 
                queryTypes: { CREATE: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        CREATE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation insertIntoCommandsCollection($objects: [commandsInsertInput!]!) {
                        data: insertIntoCommandsCollection(objects: $objects) {
                            affectedCount
                            records {
                                id
                                address
                                features
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
                introspectionResults, 
                params: { CREATE: { sparse: params } }, 
                queryTypes: { CREATE: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        CREATE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation insertIntoCommandsCollection($objects: [commandsInsertInput!]!) {
                        data: insertIntoCommandsCollection(objects: $objects) {
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

    describe('DELETE', () => {
        it('returns the correct query', () => {
            const { 
                introspectionResults, 
                params: { DELETE: { default: params } }, 
                queryTypes: { DELETE: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        DELETE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation deleteFromcommandsCollection($filter: commandsFilter, $atMost: Int!) {
                        data: deleteFromcommandsCollection(filter: $filter, atMost: $atMost) {
                            affectedCount
                            records {
                                id
                                address
                                features
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
                introspectionResults, 
                params: { DELETE: { sparse: params } }, 
                queryTypes: { DELETE: queryType }, 
                resources: { default: resource } 
            } = mockTestData();

            expect(
                print(
                    buildGqlQuery(introspectionResults)(
                        resource,
                        DELETE,
                        queryType,
                        params
                    )
                )
            ).toEqual(
                print(gql`
                    mutation deleteFromcommandsCollection($filter: commandsFilter, $atMost: Int!) {
                        data: deleteFromcommandsCollection(filter: $filter, atMost: $atMost) {
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

    it('returns the correct query for DELETE_MANY', () => {
        const { 
            introspectionResults, 
            params: { DELETE_MANY: { default: params } }, 
            queryTypes: { DELETE_MANY: queryType }, 
            resources: { default: resource } 
        } = mockTestData();

        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    DELETE_MANY,
                    queryType,
                    params
                )
            )
        ).toEqual(
            print(gql`
                mutation deleteFromcommandsCollection($filter: commandsFilter, $atMost: Int!) {
                    data: deleteFromcommandsCollection(filter: $filter, atMost: $atMost) {
                        affectedCount
                        records {
                            id
                            address
                            features
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

    it('returns the correct query for UPDATE_MANY', () => {
        const { 
            introspectionResults, 
            params: { UPDATE_MANY: { default: params } }, 
            queryTypes: { UPDATE_MANY: queryType }, 
            resources: { default: resource } 
        } = mockTestData();

        expect(
            print(
                buildGqlQuery(introspectionResults)(
                    resource,
                    UPDATE_MANY,
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
                            features
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
});
