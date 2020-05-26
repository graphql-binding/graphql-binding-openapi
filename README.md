# GraphQL Binding for Swagger/OpenAPI

# Deprecation Notices!

In the last few months, since [the transition of many libraries](https://www.prisma.io/blog/the-guild-takes-over-oss-libraries-vvluy2i4uevs) under [The Guild](http://the-guild.dev)'s leadership, We've reviewed and released many improvements and versions to [graphql-cli](https://github.com/Urigo/graphql-cli), [graphql-config](https://github.com/kamilkisiela/graphql-config) and [graphql-import](https://github.com/ardatan/graphql-import).

We've reviewed `graphql-binding`, had many meetings with current users and engaged the community also through the [roadmap issue](https://github.com/dotansimha/graphql-binding/issues/325).

What we've found is that the new [GraphQL Mesh](https://the-guild.dev/blog/graphql-mesh) library is covering not only all the current capabilities of GraphQL Binding, but also the future ideas that were introduced in the [original GraphQL Binding blog post](https://github.com/prisma-archive/prisma-blog-archive/blob/master/2018-01-12-reusing-and-composing-graphql-apis-with-graphql-bindings.mdx) and haven't come to life yet.

And the best thing - [GraphQL Mesh](https://the-guild.dev/blog/graphql-mesh) gives you all those capabilities, even if your source is not a GraphQL service at all!  
it can be GraphQL, OpenAPI/Swagger, gRPC, SQL or any other source!
And of course you can even merge all those sources into a single SDK.

Just like GraphQL Binding, you get a fully typed SDK (thanks to the protocols SDKs and the [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator)), but from any source, and that SDK can run anywhere, as a connector or as a full blown gateway.
And you can share your own "Mesh Modules" (which you would probably call "your own binding") and our community already created many of those!
Also, we decided to simply expose regular GraphQL, so you can choose how to consume it using all the awesome [fluent client SDKs out there](https://hasura.io/blog/fluent-graphql-clients-how-to-write-queries-like-a-boss/).

If you think that we've missed anything from GraphQL Binding that is not supported in a better way in GraphQL Mesh, please let us know!




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

This endpoint definition is transformed into a GraphQL schema, with all the paths from the endpoint translated into queries and mutations. The query and mutation names are based on the unique `operationName` found in the definition for each path. This schema looks like this:
```graphql
type Query {
  # GET /pet/findPetsByStatus
  findPetsByStatus(status: [String]): [findPetsByStatus_items]

  # GET /pet/findPetsByTags
  findPetsByTags(tags: [String]): [findPetsByTags_items]

  # GET /pet/{petId}
  getPetById(petId: String): getPetById

  # other queries
}

type Mutation {
  # POST /pet
  addPet(body: param_addPet_body): addPet
  
  # PUT /pet
  updatePet(body: param_updatePet_body): updatePet
  
  # PUT /pet/{petId}
  updatePetWithForm(petId: String, name: String, status: String): updatePetWithForm
  
  # DELETE /pet/{petId}
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

