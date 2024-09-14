import { gql } from '@apollo/client';

import { buildQueryFactory } from '../src/buildQuery';
import { mockTestData } from './helpers/mockTestData';


describe('buildQuery', () => {
    // const queryType = 'query_type';
    // const queryType = 'CREATE';

    // const resource = {
    //     type: { name: 'Post' },
    //     GET_LIST: queryType,
    // };
    // const introspectionResults = {
    //     resources: [resource],
    // };

    it('throws an error if resource is unknown', () => {
        const { introspectionResults: { default: introspectionResults } } = mockTestData();
        expect(() =>
            buildQueryFactory()(introspectionResults)('GET_LIST', 'Comment', {})
        ).toThrow(
            'Unknown resource Comment. Make sure it has been declared on your server side schema. Known resources are resourceTypes, commands'
        );
    });

    it('throws an error if resource does not have a query or mutation for specified AOR fetch type', () => {
        const { introspectionResults: { default: introspectionResults }, resources: { default: resource } } = mockTestData();
        const queryType = 'CREATE';

        if (resource[queryType]) delete resource[queryType];

        expect(() =>
            buildQueryFactory()(introspectionResults)(queryType, resource.type.name, {})
        ).toThrow(
            'No query or mutation matching fetch type CREATE could be found for resource commands'
        );
    });

    it('correctly builds a query and returns it along with variables and parseResponse', () => {
        const { 
            introspectionResults: { default: introspectionResults },
            params: { default: params },
        } = mockTestData();

        const queryType = 'GET_LIST';

        const resource = introspectionResults.resources.find(resource => resource.type.name === 'commands');

        const buildVariables = jest.fn(() => (params));

        const buildGqlQuery = jest.fn(
            () => gql`
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
            `
        );

        const getResponseParser = jest.fn(() => 'parseResponseFunction');
        const buildVariablesFactory = jest.fn(() => buildVariables);
        const buildGqlQueryFactory = jest.fn(() => buildGqlQuery);
        const getResponseParserFactory = jest.fn(() => getResponseParser);

        expect(
            buildQueryFactory(
                buildVariablesFactory,
                buildGqlQueryFactory,
                getResponseParserFactory
            )(introspectionResults)(queryType, 'commands', params)
        ).toEqual({
            query: gql`
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
            `,
            variables: params,
            parseResponse: 'parseResponseFunction',
        });

        expect(buildVariablesFactory).toHaveBeenCalledWith(
            introspectionResults
        );
        expect(buildGqlQueryFactory).toHaveBeenCalledWith(introspectionResults);
        expect(getResponseParserFactory).toHaveBeenCalledWith(
            introspectionResults
        );

        expect(buildVariables).toHaveBeenCalledWith(
            resource,
            queryType,
            params,
            queryType
        );
        expect(buildGqlQuery).toHaveBeenCalledWith(
            resource,
            'GET_LIST',
            queryType,
            params
        );
        expect(getResponseParser).toHaveBeenCalledWith(
            'GET_LIST',
            resource,
            queryType
        );
    });
});
