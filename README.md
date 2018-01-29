# GraphQL Binding for Swagger/OpenAPI

[![CircleCI](https://circleci.com/gh/graphql-binding/graphql-binding-openapi.svg?style=shield)](https://circleci.com/gh/graphql-binding/graphql-binding-openapi) [![npm version](https://badge.fury.io/js/graphql-binding-openapi.svg)](https://badge.fury.io/js/graphql-binding-openapi)

Embed any Swagger/OpenAPI endpoint as GraphQL API into your server application.

Both yaml and json specifications are supported.

## Install

```sh
yarn add graphql-binding-openapi
```

## How it works

A service endpoint that uses the Swagger/OpenAPI specification contains a definition file (in either JSON or YAML format). This definition file has the following structure:
```json
{
    "swagger": "2.0",
    "info": { },
    "host": "petstore.swagger.io",
    "basePath": "/v2",
    "tags": [ ],
    "schemes": [ "http" ],
    "paths": { },
    "securityDefinitions": {},
    "definitions": { },
    "externalDocs": { }
}
```
An example for the petstore endpoint can be found [here](./example/petstore.json).

This endpoint definition is transformed into a GraphQL schema, with all the paths from the endpoint translated into queries and mutations. This schema looks like this:
```graphql
type Query {
  findPetsByStatus(status: [String]): [findPetsByStatus_items]
  findPetsByTags(tags: [String]): [findPetsByTags_items]
  getPetById(petId: String): getPetById
  # other queries
}

type Mutation {
  addPet(body: param_addPet_body): addPet
  updatePet(body: param_updatePet_body): updatePet
  updatePetWithForm(petId: String, name: String, status: String): updatePetWithForm
  deletePet(api_key: String, petId: String): deletePet
  # other mutations
}
```
The full schema for the petstore endpoint can be found [here](./petstore.graphql).

The remote executable GraphQL schema (containing all the resolvers for querying the original endpoint) is exposed as a binding by `graphql-binding-openapi`, making each query and mutation available as a method on the binding class, for example:
```js
petstore.query.findPetsByStatus({ status: "available" })
petstore.mutation.addPet({ /* mutation arguments */ })
```

## Example

### Standalone
See [example directory](example) for a standalone example.

### With `graphql-yoga`
```js
const { OpenApi } = require('graphql-binding-openapi')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    findAvailablePets: async (parent, args, context, info) => {
      return context.petstore.query.findPetsByStatus({ status: "available" }, context, info)
    }
  }
}

const server = new GraphQLServer({ 
  resolvers, 
  typeDefs,
  context: async req => {
    ...req,
    petstore: await OpenApi.init('./petstore.json', 'http://petstore.swagger.io/v2')
  }
})

server.start(() => console.log('Server running on http://localhost:4000'))
```

## graphql-config support

OpenAPI bindings are supported in `graphql-config` using its extensions model. OpenAPI bindings can be added to the configuration like this:
```yaml
projects:
  petstore:
    schemaPath: src/generated/petstore.graphql
    extensions:
      openapi:
        definition: petstore.json
```
This will enable running `graphql get-schema` to output the generated schema from the definition to the defined schemaPath.

## Static bindings
Static binding support coming soon.

