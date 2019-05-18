import * as build from 'swagger-to-graphql';
import { Binding } from 'graphql-binding';
import { QueryMap, SubscriptionMap } from 'graphql-binding/dist/types'

export class OpenApi {
  static async init(openapi: string, endpoint: Function | string = null) {
    const schema = await build(openapi, endpoint)
    return new Binding<QueryMap, SubscriptionMap>({ schema, fragmentReplacements: {}})
  }
}
