import { IntrospectionResult } from "ra-data-graphql"
import { TypeKind, IntrospectionObjectType } from 'graphql';

export const mockTestData = (): {
  introspectionResults: {[key: string]: IntrospectionResult}
  resources: any;
  params: any;
  queryTypes: any;
  responses: any;
} => ({
    introspectionResults: {
        default: {
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
        circularDependencies: {
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
        }
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
        GetList: {
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
        GetOne: {
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
        Update: {
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
        Create: {
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
        Delete: {
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
        DeleteMany: {
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
        UpdateMany: {
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
        default: { foo: 'foo_value' },
        SparseFields: {
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
        GetOne: {
            id: 'foo'
        },
        GetOneSparseFields: {
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
        Create: {
            data: { 
                // id: 'foo',
                address: 'bar',
                linkedType_id: 'baz', 
                resourceType_id: 'not updated' // this should never get updated b/c it is not in the insert input
            },
        },
        CreateSparseFields: {
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
        Update: {
            id: 'foo',
            data: { 
                address: 'bar',
                linkedType_id: 'baz', // this should never get updated b/c it is not in the update input
            },
        },
        UpdateSparseFields: {
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
        UpdateMany: {
            ids: ['foo', 'id'],
            data: { 
                address: 'bar',
                linkedType_id: 'baz', // this should never get updated b/c it is not in the update input
            },
        },
        UpdateManySparseFields: {
            ids: ['foo', 'id'],
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
        Delete: {
            id: 'foo',
            previousData: {},
        },
        DeleteSparseFields: {
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
        DeleteMany: {
            ids: ['foo', 'id'],
            previousData: {},
        },
        DeleteManySparseFields: {
            ids: ['foo', 'id'],
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
    responses: {
        GetOne: {
            data: {
                data: {
                    id: 'foo',
                    address: 'bar',
                }
            }
        },
        Create: {
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
        Update: {
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
        UpdateMany: {
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
        Delete: {
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
        DeleteMany: {
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
