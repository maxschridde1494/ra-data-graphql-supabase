import { IntrospectionResult } from "ra-data-graphql"
import { TypeKind, IntrospectionType } from 'graphql';

export const mockTestData = (): {
  introspectionResults: IntrospectionResult
  resources: any;
  params: any;
  queryTypes: any;
  responses: any;
} => ({
    introspectionResults: {
        resources: [
            {
                type: {
                    name: 'resourceTypes',
                    fields: [
                        {
                            name: 'id',
                            type: { 
                                kind: 'SCALAR', 
                                name: 'ID',
                                __typename: 'ID'
                            },
                        },
                        {
                            name: 'name',
                            type: { 
                                kind: 'SCALAR', 
                                name: 'String',
                                __typename: 'String'
                            },
                        },
                        {
                            name: 'foo',
                            type: { 
                                kind: 'SCALAR', 
                                name: 'String',
                                __typename: 'String'
                            },
                        },
                    ],
                    __typename: 'resourceTypes',
                    enumValues: [],
                    interfaces: [
                        {
                            kind: "INTERFACE",
                            name: "Node",
                            ofType: null,
                            __typename: "Node"
                        }
                    ],
                    description: null,
                    inputFields: null,
                    possibleTypes: null,
                },
            },
            {
                CREATE: 'CREATE',
                UPDATE: 'UPDATE',
                DELETE: 'DELETE',
                GET_LIST: 'GET_LIST',
                GET_ONE: 'GET_ONE',
                GET_MANY: 'GET_MANY',
                GET_MANY_REFERENCE: 'GET_MANY_REFERENCE',
                DELETE_MANY: 'DELETE_MANY',
                UPDATE_MANY: 'UPDATE_MANY',
                type: {
                    name: 'commands',
                    fields: [
                        {
                            name: 'id',
                            type: { 
                                kind: 'SCALAR', 
                                name: 'ID',
                                ofType: null,
                                __typename: 'ID'
                            },
                        },
                        {
                            name: 'address',
                            type: { 
                                kind: 'SCALAR', 
                                name: 'String',
                                ofType: null,
                                __typename: 'String'
                            },
                        },
                        {
                            name: 'foo1',
                            type: { 
                                kind: 'SCALAR', 
                                name: '_internalField',
                                ofType: null,
                                __typename: '_internalField'
                            },
                        },
                        {
                            // Foreign key field for the linked object
                            name: 'linkedType_id',
                            type: {
                                kind: 'SCALAR',
                                name: 'ID',
                                ofType: null,
                                __typename: 'ID'
                            },
                        },
                        {
                            // Pluralized linked object field
                            name: 'linkedTypes',
                            type: {
                                kind: 'OBJECT',
                                name: 'linkedTypes',
                                ofType: null,
                                __typename: 'linkedTypes'
                            },
                        },
                        {
                            // Foreign key field for resourceType
                            name: 'anotherLinkedType_id',
                            type: {
                                kind: 'SCALAR',
                                name: 'ID',
                                ofType: null,
                                __typename: 'ID'
                            },
                        },
                        {
                            // Pluralized resource field
                            name: 'anotherLinkedTypes',
                            type: {
                                kind: 'OBJECT',
                                name: 'linkedTypes',
                                ofType: null,
                                __typename: 'linkedTypes'
                            },
                        },
                        {
                        // Foreign key field for resourceType
                        name: 'resourceType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized resource field
                        name: 'resourceTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'resourceTypes',
                            ofType: null,
                            __typename: 'resourceTypes'
                        },
                    },
                    ],
                    __typename: 'commands',
                    enumValues: [],
                    interfaces: [
                        {
                            kind: "INTERFACE",
                            name: "Node",
                            ofType: null,
                            __typename: "Node"
                        }
                    ],
                    description: null,
                    inputFields: null,
                    possibleTypes: null,
                },
            },
        ],
        types: [
            {
                name: 'linkedTypes',
                fields: [
                    {
                        name: 'id',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        name: 'title',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'String',
                            ofType: null,
                            __typename: 'String'
                        },
                    },
                    {
                        // Correctly singular foreign key field
                        name: 'nestedLink_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized object field representing the relationship to the nested linked type
                        name: 'nestedLinks',
                        type: {
                            kind: 'OBJECT',
                            name: 'nestedLinks',
                            ofType: null,
                            __typename: 'nestedLinks'
                        },
                    },
                ],
                __typename: 'linkedTypes',
                enumValues: [],
                interfaces: [
                    {
                        kind: "INTERFACE",
                        name: "Node",
                        ofType: null,
                        __typename: "Node"
                    }
                ],
                description: null,
                inputFields: null,
                possibleTypes: null,
            },
            {
                kind: "INPUT_OBJECT",
                name: "linkedTypesFilter",
                fields: null,
                __typename: "linkedTypesFilter",
                enumValues: [],
                interfaces: [],
                description: null,
                inputFields: [
                    {
                        name: "id",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "UUIDFilter",
                            ofType: null,
                            __typename: "UUIDFilter"
                        },
                        __typename: "id",
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "title",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "StringFilter",
                            ofType: null,
                            __typename: "StringFilter"
                        },
                        __typename: "title",
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "nestedLink_id",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "StringFilter",
                            ofType: null,
                            __typename: "StringFilter"
                        },
                        __typename: "nestedLink_id",
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "and",
                        type: {
                            kind: "LIST",
                            name: null,
                            ofType: {
                                kind: "NON_NULL",
                                name: null,
                                ofType: {
                                    kind: "INPUT_OBJECT",
                                    name: "linkedTypesFilter",
                                    ofType: null,
                                    __typename: "linkedTypesFilter"
                                },
                                __typename: null
                            },
                            __typename: null
                        },
                        __typename: "and",
                        description: "Returns true only if all its inner filters are true, otherwise returns false",
                        defaultValue: null
                    },
                    {
                        name: "or",
                        type: {
                            kind: "LIST",
                            name: null,
                            ofType: {
                                kind: "NON_NULL",
                                name: null,
                                ofType: {
                                    kind: "INPUT_OBJECT",
                                    name: "linkedTypesFilter",
                                    ofType: null,
                                    __typename: "linkedTypesFilter"
                                },
                                __typename: null
                            },
                            __typename: null
                        },
                        __typename: "or",
                        description: "Returns true if at least one of its inner filters is true, otherwise returns false",
                        defaultValue: null
                    },
                    {
                        name: "not",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "linkedTypesFilter",
                            ofType: null,
                            __typename: "linkedTypesFilter"
                        },
                        __typename: "not",
                        description: "Negates a filter",
                        defaultValue: null
                    }
                ],
                possibleTypes: null
            },
            {
                name: 'nestedLinks',
                fields: [
                    {
                        name: 'id',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        name: 'bar',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'String',
                            ofType: null,
                            __typename: 'String'
                        },
                    },
                ],
                __typename: 'nestedLinks',
                enumValues: [],
                interfaces: [
                    {
                        kind: "INTERFACE",
                        name: "Node",
                        ofType: null,
                        __typename: "Node"
                    }
                ],
                description: null,
                inputFields: null,
                possibleTypes: null,
            },
            {
                kind: "INPUT_OBJECT",
                name: "nestedLinksFilter",
                fields: null,
                __typename: "nestedLinksFilter",
                enumValues: [],
                interfaces: [],
                description: null,
                inputFields: [
                    {
                        name: "id",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "UUIDFilter",
                            ofType: null,
                            __typename: "UUIDFilter"
                        },
                        __typename: "id",
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "bar",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "StringFilter",
                            ofType: null,
                            __typename: "StringFilter"
                        },
                        __typename: "title",
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "and",
                        type: {
                            kind: "LIST",
                            name: null,
                            ofType: {
                                kind: "NON_NULL",
                                name: null,
                                ofType: {
                                    kind: "INPUT_OBJECT",
                                    name: "nestedLinksFilter",
                                    ofType: null,
                                    __typename: "nestedLinksFilter"
                                },
                                __typename: null
                            },
                            __typename: null
                        },
                        __typename: "and",
                        description: "Returns true only if all its inner filters are true, otherwise returns false",
                        defaultValue: null
                    },
                    {
                        name: "or",
                        type: {
                            kind: "LIST",
                            name: null,
                            ofType: {
                                kind: "NON_NULL",
                                name: null,
                                ofType: {
                                    kind: "INPUT_OBJECT",
                                    name: "nestedLinksFilter",
                                    ofType: null,
                                    __typename: "nestedLinksFilter"
                                },
                                __typename: null
                            },
                            __typename: null
                        },
                        __typename: "or",
                        description: "Returns true if at least one of its inner filters is true, otherwise returns false",
                        defaultValue: null
                    },
                    {
                        name: "not",
                        type: {
                            kind: "INPUT_OBJECT",
                            name: "nestedLinksFilter",
                            ofType: null,
                            __typename: "nestedLinksFilter"
                        },
                        __typename: "not",
                        description: "Negates a filter",
                        defaultValue: null
                    }
                ],
                possibleTypes: null
            },
            {
                kind: "INTERFACE",
                name: "Node",
                fields: [
                    {
                        args: [],
                        name: "nodeId",
                        type: {
                            kind: "NON_NULL",
                            name: null,
                            ofType: {
                                kind: "SCALAR",
                                name: "ID",
                                ofType: null,
                                __typename: "ID"
                            },
                            __typename: null
                        },
                        __typename: "nodeId",
                        description: "Retrieves a record by `ID`",
                        isDeprecated: false,
                        deprecationReason: null
                    }
                ],
                __typename: "Node",
                enumValues: [],
                interfaces: [],
                description: null,
                inputFields: null,
                possibleTypes: [
                    {
                        kind: "OBJECT",
                        name: "linkedTypes",
                        ofType: null,
                        __typename: "linkedTypes"
                    },
                    {
                        kind: "OBJECT",
                        name: "nestedLinks",
                        ofType: null,
                        __typename: "nestedLinks"
                    },
                    {
                        kind: "OBJECT",
                        name: "commands",
                        ofType: null,
                        __typename: "commands"
                    },
                    {
                        kind: "OBJECT",
                        name: "resourceTypes",
                        ofType: null,
                        __typename: "resourceTypes"
                    }
                ]
            },
            {
                kind: "INPUT_OBJECT",
                name: "commandsUpdateInput",
                fields: null,
                enumValues: [],
                interfaces: [],
                description: null,
                inputFields: [
                    {
                        name: "address",
                        type: {
                            kind: "SCALAR",
                            name: "String",
                            ofType: null
                        },
                        description: null,
                        defaultValue: null
                    },
                ],
                possibleTypes: null
            },
            {
                kind: "INPUT_OBJECT",
                name: "commandsInsertInput",
                fields: null,
                enumValues: [],
                interfaces: [],
                description: null,
                inputFields: [
                    {
                        name: "id",
                        type: {
                            kind: "SCALAR",
                            name: "UUID",
                            ofType: null
                        },
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "address",
                        type: {
                            kind: "SCALAR",
                            name: "String",
                            ofType: null
                        },
                        description: null,
                        defaultValue: null
                    },
                    {
                        name: "linkedType_id",
                        type: {
                            kind: "SCALAR",
                            name: "UUID",
                            ofType: null
                        },
                        description: null,
                        defaultValue: null
                    },
                    // {
                    //     name: "created_at",
                    //     type: {
                    //         kind: "SCALAR",
                    //         name: "Datetime",
                    //         ofType: null
                    //     },
                    //     description: null,
                    //     defaultValue: null
                    // },
                    // {
                    //     name: "updated_at",
                    //     type: {
                    //         kind: "SCALAR",
                    //         name: "Datetime",
                    //         ofType: null
                    //     },
                    //     description: null,
                    //     defaultValue: null
                    // }
                ],
                possibleTypes: null
            },
        ],
        queries: [
            {
                args: [
                    {
                        name: "nodeId",
                        type: {
                            kind: "NON_NULL",
                            name: null,
                            ofType: {
                                kind: "SCALAR",
                                name: "ID",
                                ofType: null,
                                __typename: "ID"
                            },
                            __typename: null
                        },
                        __typename: "nodeId",
                        description: "The record's `ID`",
                        defaultValue: null
                    }
                ],
                name: "node",
                type: {
                    kind: "INTERFACE",
                    name: "Node",
                    ofType: null,
                    __typename: "Node"
                },
                __typename: "node",
                description: "Retrieve a record by its `ID`",
                isDeprecated: false,
                deprecationReason: null
            },
        ]
    }, 
    resources: {
        default: {
            GET_LIST: 'GET_LIST',
            GET_ONE: 'GET_ONE',
            GET_MANY: 'GET_MANY',
            GET_MANY_REFERENCE: 'GET_MANY_REFERENCE',
            CREATE: 'CREATE',
            UPDATE: 'UPDATE',
            DELETE: 'DELETE',
            DELETE_MANY: 'DELETE_MANY',
            UPDATE_MANY: 'UPDATE_MANY',
            type: {
                name: 'commands', // Assuming resource is of 'resourceTypes'
                fields: [
                    {
                        name: 'id',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        name: 'address',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'String',
                            ofType: null,
                            __typename: 'String'
                        },
                    },
                    {
                        name: 'foo1',
                        type: { 
                            kind: 'SCALAR', 
                            name: '_internalField',
                            ofType: null,
                            __typename: '_internalField'
                        },
                    },
                    {
                        // Foreign key field for the linked object
                        name: 'linkedType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized linked object field
                        name: 'linkedTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'linkedTypes',
                            ofType: null,
                            __typename: 'linkedTypes'
                        },
                    },
                    {
                        // Foreign key field for resourceType
                        name: 'resourceType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized resource field
                        name: 'resourceTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'resourceTypes',
                            ofType: null,
                            __typename: 'resourceTypes'
                        },
                    },
                ],
                __typename: 'commands',
                enumValues: [],
                interfaces: [
                        {
                            kind: "INTERFACE",
                            name: "Node",
                            ofType: null,
                            __typename: "Node"
                        }
                    ],
                description: null,
                inputFields: null,
                possibleTypes: null,
            },
        },
        WithMultipleFieldsOfSameType: {
            type: {
                name: 'commands',
                fields: [
                    {
                        name: 'id',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        name: 'address',
                        type: { 
                            kind: 'SCALAR', 
                            name: 'String',
                            ofType: null,
                            __typename: 'String'
                        },
                    },
                    {
                        name: 'foo1',
                        type: { 
                            kind: 'SCALAR', 
                            name: '_internalField',
                            ofType: null,
                            __typename: '_internalField'
                        },
                    },
                    {
                        // Foreign key field for the linked object
                        name: 'linkedType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized linked object field
                        name: 'linkedTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'linkedTypes',
                            ofType: null,
                            __typename: 'linkedTypes'
                        },
                    },
                    {
                        // Foreign key field for resourceType
                        name: 'anotherLinkedType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized resource field
                        name: 'anotherLinkedTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'linkedTypes',
                            ofType: null,
                            __typename: 'linkedTypes'
                        },
                    },
                    {
                        // Foreign key field for resourceType
                        name: 'resourceType_id',
                        type: {
                            kind: 'SCALAR',
                            name: 'ID',
                            ofType: null,
                            __typename: 'ID'
                        },
                    },
                    {
                        // Pluralized resource field
                        name: 'resourceTypes',
                        type: {
                            kind: 'OBJECT',
                            name: 'resourceTypes',
                            ofType: null,
                            __typename: 'resourceTypes'
                        },
                    },
                ],
                __typename: 'commands',
                enumValues: [],
                interfaces: [
                        {
                            kind: "INTERFACE",
                            name: "Node",
                            ofType: null,
                            __typename: "Node"
                        }
                    ],
                description: null,
                inputFields: null,
                possibleTypes: null,
            },
        }
    },
    queryTypes: {
        GET_LIST: {
            name: 'allCommand',
            args: [
                {
                    name: 'foo',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: { kind: TypeKind.SCALAR, name: 'Int' },
                    },
                },
                {
                name: 'barId',
                type: { kind: TypeKind.SCALAR },
                },
                {
                    name: 'barIds',
                    type: { kind: TypeKind.SCALAR },
                },
                { name: 'bar' },
            ],
        },
        GET_MANY_REFERENCE: {
            args: [
                {
                    name: "first",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "first",
                    description: "Query the first `n` records in the collection",
                    defaultValue: null
                },
                {
                    name: "last",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "last",
                    description: "Query the last `n` records in the collection",
                    defaultValue: null
                },
                {
                    name: "before",
                    type: {
                        kind: "SCALAR",
                        name: "Cursor",
                        ofType: null,
                        __typename: "Cursor"
                    },
                    __typename: "before",
                    description: "Query values in the collection before the provided cursor",
                    defaultValue: null
                },
                {
                    name: "after",
                    type: {
                        kind: "SCALAR",
                        name: "Cursor",
                        ofType: null,
                        __typename: "Cursor"
                    },
                    __typename: "after",
                    description: "Query values in the collection after the provided cursor",
                    defaultValue: null
                },
                {
                    name: "offset",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "offset",
                    description: "Skip n values from the after cursor. Alternative to cursor pagination. Backward pagination not supported.",
                    defaultValue: null
                },
                {
                    name: "filter",
                    type: {
                        kind: "INPUT_OBJECT",
                        name: "commandsFilter",
                        ofType: null,
                        __typename: "commandsFilter"
                    },
                    __typename: "filter",
                    description: "Filters to apply to the results set when querying from the collection",
                    defaultValue: null
                },
                {
                    name: "orderBy",
                    type: {
                        kind: "LIST",
                        name: null,
                        ofType: {
                            kind: "NON_NULL",
                            name: null,
                            ofType: {
                                kind: "INPUT_OBJECT",
                                name: "commandsOrderBy",
                                ofType: null,
                                __typename: "commandsOrderBy"
                            },
                            __typename: null
                        },
                        __typename: null
                    },
                    __typename: "orderBy",
                    description: "Sort order to apply to the collection",
                    defaultValue: null
                }
            ],
            name: "commandsCollection",
            type: {
                kind: "OBJECT",
                name: "commandsConnection",
                ofType: null,
                __typename: "commandsConnection"
            },
            __typename: "commandsCollection",
            description: "A pagable collection of type `commands`",
            isDeprecated: false,
            deprecationReason: null
        },
        GET_MANY: {
            args: [
                {
                    name: "first",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "first",
                    description: "Query the first `n` records in the collection",
                    defaultValue: null
                },
                {
                    name: "last",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "last",
                    description: "Query the last `n` records in the collection",
                    defaultValue: null
                },
                {
                    name: "before",
                    type: {
                        kind: "SCALAR",
                        name: "Cursor",
                        ofType: null,
                        __typename: "Cursor"
                    },
                    __typename: "before",
                    description: "Query values in the collection before the provided cursor",
                    defaultValue: null
                },
                {
                    name: "after",
                    type: {
                        kind: "SCALAR",
                        name: "Cursor",
                        ofType: null,
                        __typename: "Cursor"
                    },
                    __typename: "after",
                    description: "Query values in the collection after the provided cursor",
                    defaultValue: null
                },
                {
                    name: "offset",
                    type: {
                        kind: "SCALAR",
                        name: "Int",
                        ofType: null,
                        __typename: "Int"
                    },
                    __typename: "offset",
                    description: "Skip n values from the after cursor. Alternative to cursor pagination. Backward pagination not supported.",
                    defaultValue: null
                },
                {
                    name: "filter",
                    type: {
                        kind: "INPUT_OBJECT",
                        name: "commandsFilter",
                        ofType: null,
                        __typename: "commandsFilter"
                    },
                    __typename: "filter",
                    description: "Filters to apply to the results set when querying from the collection",
                    defaultValue: null
                },
                {
                    name: "orderBy",
                    type: {
                        kind: "LIST",
                        name: null,
                        ofType: {
                            kind: "NON_NULL",
                            name: null,
                            ofType: {
                                kind: "INPUT_OBJECT",
                                name: "commandsOrderBy",
                                ofType: null,
                                __typename: "commandsOrderBy"
                            },
                            __typename: null
                        },
                        __typename: null
                    },
                    __typename: "orderBy",
                    description: "Sort order to apply to the collection",
                    defaultValue: null
                }
            ],
            name: "commandsCollection",
            type: {
                kind: "OBJECT",
                name: "commandsConnection",
                ofType: null,
                __typename: "commandsConnection"
            },
            __typename: "commandsCollection",
            description: "A pagable collection of type `commands`",
            isDeprecated: false,
            deprecationReason: null
        },
        GET_ONE: {
            name: 'commandsById',
            args: [
                {
                    name: 'id',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR,
                            name: 'ID',
                        },
                    },
                },
            ],
        },
        UPDATE: {
            name: 'updatecommandsCollection',
            args: [
                {
                    name: 'filter',
                    type: { kind: TypeKind.OBJECT, name: 'commandsFilter' },
                },
                {
                    name: 'set',
                    type: { 
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.OBJECT, 
                            name: 'commandsUpdateInput'
                        }
                    },
                },
                {
                    name: 'atMost',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR, 
                            name: 'Int' 
                        }
                    }
                },
            ],
        },
        CREATE: {
            name: 'insertIntoCommandsCollection',
            args: [
                {
                    name: 'objects',
                    type: { 
                        kind: TypeKind.NON_NULL,
                        name: null,
                        ofType: {
                            kind: TypeKind.LIST,
                            name: null,
                            ofType: {
                                kind: TypeKind.NON_NULL,
                                name: null,
                                ofType: {
                                    kind: TypeKind.INPUT_OBJECT, 
                                    name: 'commandsInsertInput'
                                },
                                __typename: null
                            },
                        }
                    },
                },
            ],
        },
        DELETE: {
            name: 'deleteFromcommandsCollection',
            args: [
                {
                    name: 'filter',
                    type: { kind: TypeKind.OBJECT, name: 'commandsFilter' },
                },
                {
                    name: 'atMost',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR, 
                            name: 'Int' 
                        }
                    }
                },
            ],
        },
        DELETE_MANY: {
            name: 'deleteFromcommandsCollection',
            args: [
                {
                    name: 'filter',
                    type: { kind: TypeKind.OBJECT, name: 'commandsFilter' },
                },
                {
                    name: 'atMost',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR, 
                            name: 'Int' 
                        }
                    }
                },
            ],
        },
        UPDATE_MANY: {
            name: 'updatecommandsCollection',
            args: [
                {
                    name: 'filter',
                    type: { kind: TypeKind.OBJECT, name: 'commandsFilter' },
                },
                {
                    name: 'set',
                    type: { 
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.OBJECT, 
                            name: 'commandsUpdateInput'
                        }
                    },
                },
                {
                    name: 'atMost',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR, 
                            name: 'Int' 
                        }
                    }
                },
            ],
        },
    },
    params: {
        GET_LIST: {
            default: { 
                foo: 'foo_value' 
            },
            filtered: {
                filter: {
                    ids: ['foo1', 'foo2'],
                    linkedTypesId_op_in: ['tag1', 'tag2'],
                },
                pagination: { page: 10, perPage: 10 },
                sort: { field: 'sortField', order: 'DESC' },
            },
            sparse: {
                foo: 'foo_value',
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        GET_MANY: {
            default: { 
                ids: ['command1', 'command2'],
            },
            sparse: {
                ids: ['command1', 'command2'],
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        GET_MANY_REFERENCE: {
            default: { 
                id: 'foo',
                target: 'linkedType_id',
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'sortField', order: 'ASC' },
            },
            sparse: {
                id: 'foo',
                target: 'linkedType_id',
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'sortField', order: 'ASC' },
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        GET_ONE: {
            default: { id: 'foo' },
            sparse: {
                id: 'foo',
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        CREATE: {
            default: {
                data: { 
                    // id: 'foo',
                    address: 'bar',
                    linkedType_id: 'baz', 
                    resourceType_id: 'not updated' // this should never get updated b/c it is not in the insert input
                },
            },
            sparse: {
                data: { 
                    // id: 'foo',
                    address: 'bar',
                    linkedType_id: 'baz', 
                    resourceType_id: 'not updated', // this should never get updated b/c it is not in the insert input
                    meta: {
                        sparseFields: [
                            'id',
                            'address',
                            { linkedTypes: ['id', 'title'] },
                            { resourceTypes: ['id', 'foo', 'name'] },
                        ],
                    },
                },
            },
        },
        UPDATE: {
            default: {
                id: 'foo',
                data: { 
                    address: 'bar',
                    linkedType_id: 'baz', // this should never get updated b/c it is not in the update input
                },
            },
            sparse: {
                id: 'foo',
                data: { 
                    address: 'bar',
                    linkedType_id: 'baz', // this should never get updated b/c it is not in the update input
                },
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        UPDATE_MANY: { 
            default: {
                ids: ['foo', 'id'],
                data: { 
                    address: 'bar',
                    linkedType_id: 'baz', // this should never get updated b/c it is not in the update input
                },
            },
        },
        DELETE: {
            default: {
                id: 'foo',
                previousData: {},
            },
            sparse: {
                id: 'foo',
                previousData: {},
                meta: {
                    sparseFields: [
                        'id',
                        'address',
                        { linkedTypes: ['id', 'title'] },
                        { resourceTypes: ['id', 'foo', 'name'] },
                    ],
                },
            },
        },
        DELETE_MANY: {
            default: {
                ids: ['foo', 'id'],
                previousData: {},
            },
        } 
    },
    responses: {
        GET_ONE: {
            data: {
                data: {
                    id: 'foo',
                    address: 'bar',
                }
            }
        },
        CREATE: {
            data: {
                data: {
                    affectedCount: 1,
                    records: [
                        {
                            id: 'foo',
                            address: 'bar',
                        }
                    ]
                }
            }
        },
        UPDATE: {
            data: {
                data: {
                    affectedCount: 1,
                    records: [
                        {
                            id: 'foo',
                            address: 'bar',
                        }
                    ]
                }
            }
        },
        UPDATE_MANY: {
            data: {
                data: {
                    affectedCount: 2,
                    records: [
                        {
                            id: 'foo',
                            address: 'bar',
                        },
                        {
                            id: 'id',
                            address: 'address',
                        }
                    ]
                }
            }
        },
        DELETE: {
            data: {
                data: {
                    affectedCount: 1,
                    records: [
                        {
                            id: 'foo',
                            address: 'bar',
                        }
                    ]
                }
            }
        },
        DELETE_MANY: {
            data: {
                data: {
                    affectedCount: 2,
                    records: [
                        {
                            id: 'foo',
                            address: 'bar',
                        },
                        {
                            id: 'id',
                            address: 'address',
                        }
                    ]
                }
            }
        },
    }
})

export const circularDependencyTypes: IntrospectionType[] = [
    {
        name: 'linkedTypes',
        fields: [
            {
                name: 'id',
                type: { 
                    kind: 'SCALAR', 
                    name: 'ID',
                    ofType: null,
                    __typename: 'ID'
                },
            },
            {
                name: 'title',
                type: { 
                    kind: 'SCALAR', 
                    name: 'String',
                    ofType: null,
                    __typename: 'String'
                },
            },
            {
                // Correctly singular foreign key field
                name: 'child_id',
                type: {
                    kind: 'SCALAR',
                    name: 'ID',
                    ofType: null,
                    __typename: 'ID'
                },
            },
            {
                // Pluralized object field representing the relationship to the nested linked type
                name: 'childs',
                type: {
                    kind: 'OBJECT',
                    name: 'linkedTypes',
                    ofType: null,
                    __typename: 'linkedTypes'
                },
            },
        ],
        __typename: 'linkedTypes',
        enumValues: [],
        interfaces: [
            {
                kind: "INTERFACE",
                name: "Node",
                ofType: null,
                __typename: "Node"
            }
        ],
        description: null,
        inputFields: null,
        possibleTypes: null,
    },
    {
        kind: "INTERFACE",
        name: "Node",
        fields: [
            {
                args: [],
                name: "nodeId",
                type: {
                    kind: "NON_NULL",
                    name: null,
                    ofType: {
                        kind: "SCALAR",
                        name: "ID",
                        ofType: null,
                        __typename: "ID"
                    },
                    __typename: null
                },
                __typename: "nodeId",
                description: "Retrieves a record by `ID`",
                isDeprecated: false,
                deprecationReason: null
            }
        ],
        __typename: "Node",
        enumValues: [],
        interfaces: [],
        description: null,
        inputFields: null,
        possibleTypes: [
            {
                kind: "OBJECT",
                name: "linkedTypes",
                ofType: null,
                __typename: "linkedTypes"
            },
            {
                kind: "OBJECT",
                name: "nestedLinks",
                ofType: null,
                __typename: "nestedLinks"
            },
            {
                kind: "OBJECT",
                name: "commands",
                ofType: null,
                __typename: "commands"
            },
            {
                kind: "OBJECT",
                name: "resourceTypes",
                ofType: null,
                __typename: "resourceTypes"
            }
        ]
    },
]