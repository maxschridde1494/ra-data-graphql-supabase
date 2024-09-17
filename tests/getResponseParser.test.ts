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
import getResponseParser from '../src/getResponseParser';
import { mockTestData } from './mockTestData';

describe('getResponseParser', () => {
    it.each([[GET_LIST], [GET_MANY], [GET_MANY_REFERENCE]])(
        'returns the response expected for %s',
        type => {
            const {
                introspectionResults,
                queryTypes: { [type]: queryType },
                resources: { default: resource },
                responses: { GET_LIST: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    GET_LIST,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.items.edges.map(({ node }) => ({
                    ...node,
                    'linkedTypes.id': node.linkedTypes.id,
                    'resourceTypes.id': node.resourceTypes.id,
                })),
                total: response.data.items.totalCount,
            });
        }
    );

    describe(GET_ONE, () => {
        it(`returns the response expected for GET_ONE`, () => {
            const {
                introspectionResults,
                queryTypes: { GET_ONE: queryType },
                resources: { default: resource },
                responses: { GET_ONE: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    GET_ONE,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.data,
            });
        });
    });

    const mutationTypes = [[CREATE], [UPDATE], [DELETE]];

    describe.each(mutationTypes)('%s', type => {
        it(`returns the response expected for ${type}`, () => {
            const queryTypeKey =
                type === UPDATE
                    ? 'UPDATE'
                    : type === CREATE
                      ? 'CREATE'
                      : 'DELETE';

            const {
                introspectionResults,
                queryTypes: { [queryTypeKey]: queryType },
                // params: { [queryTypeKey]: params },
                resources: { default: resource },
                responses: { [queryTypeKey]: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.data.records[0],
            });
        });

        it(`returns the response expected for ${type} with simple arrays of values`, () => {
            const {
                introspectionResults,
                queryTypes: { [type]: queryType },
                resources: { default: resource },
                responses: { [type]: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.data.records[0],
            });
        });

        it(`returns the response expected for ${type} with aliases`, () => {
            const {
                introspectionResults,
                queryTypes: { [type]: queryType },
                resources: { default: resource },
                responses: { [type]: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.data.records[0],
            });
        });

        it(`returns the response expected for ${type} with embedded objects`, () => {
            const {
                introspectionResults,
                queryTypes: { [type]: queryType },
                resources: { default: resource },
                responses: { [type]: response },
            } = mockTestData();

            expect(
                getResponseParser(introspectionResults)(
                    type,
                    resource,
                    queryType
                )(response)
            ).toEqual({
                data: response.data.data.records[0],
            });
        });
    });

    it('returns the response expected for DELETE_MANY', () => {
        const {
            introspectionResults,
            queryTypes: { DELETE_MANY: queryType },
            resources: { default: resource },
            responses: { DELETE_MANY: response },
        } = mockTestData();

        expect(
            getResponseParser(introspectionResults)(
                DELETE_MANY,
                resource,
                queryType
            )(response)
        ).toEqual({
            data: response.data.data.records.map(({ id }) => id),
        });
    });

    it('returns the response expected for UPDATE_MANY', () => {
        const {
            introspectionResults,
            queryTypes: { UPDATE_MANY: queryType },
            resources: { default: resource },
            responses: { UPDATE_MANY: response },
        } = mockTestData();

        expect(
            getResponseParser(introspectionResults)(
                UPDATE_MANY,
                resource,
                queryType
            )(response)
        ).toEqual({
            data: response.data.data.records.map(({ id }) => id),
        });
    });
});
