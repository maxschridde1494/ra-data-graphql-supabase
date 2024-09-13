# ra-data-graphql-supabase

A GraphQL data provider for [react-admin](https://github.com/marmelab/react-admin/) and [supabase pg_graphql](https://github.com/supabase/pg_graphql) built with [Apollo](https://www.apollodata.com/).

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

## Installation

Install with:

```sh
npm install --save graphql ra-data-graphql-supabase
```

or

```sh
yarn add graphql ra-data-graphql-supabase
```

## Usage

The `ra-data-graphql-supabase` package exposes a single function, which is a constructor for a `dataProvider` based on a GraphQL endpoint. When executed, this function calls the GraphQL endpoint, running an [introspection](https://graphql.org/learn/introspection/) query. It uses the result of this query (the GraphQL schema) to automatically configure the `dataProvider` accordingly.

```jsx
// in App.js
import React from 'react';
import { Component } from 'react';
import buildGraphQLProvider from 'ra-data-graphql-supabase';
import { Admin, Resource } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const dataProvider = buildGraphQLProvider({ buildQuery });

const App = () => (
    <Admin dataProvider={dataProvider} >
        <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} />
    </Admin>
);

export default App;
```
**Note**: the parser will generate additional `.id` properties for relation based types. These properties should be used as sources for reference based fields and inputs like `ReferenceField`: `<ReferenceField label="Author Name" source="author.id" reference="User">`.

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildGraphQLProvider` like this:

```js
buildGraphQLProvider({ clientOptions: { uri: 'http://localhost:4000', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildGraphQLProvider({ client: myClient });
```

### Overriding a specific query

The default behavior might not be optimized especially when dealing with references. You can override a specific query by wrapping the `buildQuery` function:

```js
// in src/dataProvider.js
import buildGraphQLProvider, { buildQuery } from 'ra-data-graphql-supabase';

const myBuildQuery = introspection => (fetchType, resource, params) => {
    const builtQuery = buildQuery(introspection)(fetchType, resource, params);

    if (resource === 'Command' && fetchType === 'GET_ONE') {
        return {
            // Use the default query variables and parseResponse
            ...builtQuery,
            // Override the query
            query: gql`
                query Command($id: ID!) {
                    data: Command(id: $id) {
                        id
                        reference
                        customer {
                            id
                            firstName
                            lastName
                        }
                    }
                }`,
        };
    }

    return builtQuery;
};

export default buildGraphQLProvider({ buildQuery: myBuildQuery })
```

### Customize the introspection

These are the default options for introspection:

```js
const introspectionOptions = {
    include: [], // Either an array of types to include or a function which will be called for every type discovered through introspection
    exclude: [], // Either an array of types to exclude or a function which will be called for every type discovered through introspection
};

// Including types
const introspectionOptions = {
    include: ['Post', 'Comment'],
};

// Excluding types
const introspectionOptions = {
    exclude: ['CommandItem'],
};

// Including types with a function
const introspectionOptions = {
    include: type => ['Post', 'Comment'].includes(type.name),
};

// Including types with a function
const introspectionOptions = {
    exclude: type => !['Post', 'Comment'].includes(type.name),
};
```

**Note**: `exclude` and `include` are mutually exclusives and `include` will take precedence.

**Note**: When using functions, the `type` argument will be a type returned by the introspection query. Refer to the [introspection](https://graphql.org/learn/introspection/) documentation for more information.

Pass the introspection options to the `buildApolloProvider` function:

```js
buildApolloProvider({ introspection: introspectionOptions });
```

## Sparse Field Support for Queries and Mutations

By default, for every API call this data provider returns all top level fields in your GraphQL schema as well as association objects containing the association's ID. If you would like to implement sparse field support for your requests, you can request the specific fields you want in a request by passing them to the dataProvider via the available [meta param](https://marmelab.com/react-admin/Actions.html#meta-parameter). For example,

```js
dataProvider.getOne(
    'posts',
    { 
        id, 
        meta: { 
            sparseFields: [
                'id', 
                'title', 
                { 
                    comments: [
                        'description', 
                        { 
                            author : [
                                'name', 
                                'email'
                            ]
                        }
                    ]
                }
            ]
        }
    },
);
```
This can increase efficiency, optimize client performance, improve security and reduce over-fetching. Also, it allows for the request of nested association fields beyond just their ID. It is available for all dataprovider actions.

## `DELETE_MANY` and `UPDATE_MANY` Optimizations

Your GraphQL backend may not allow multiple deletions or updates in a single query. This provider defaults to simply making multiple requests to handle those. This is obviously not ideal but can be alleviated by supplying your own `ApolloClient` which could use the [apollo-link-batch-http](https://www.apollographql.com/docs/link/links/batch-http.html) link if your GraphQL backend support query batching.

## Contributing

Run the tests with this command:

```sh
make test
```
