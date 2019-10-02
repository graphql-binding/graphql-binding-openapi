import { createSchema, Options } from 'swagger-to-graphql';
import { Binding } from 'graphql-binding';
import { QueryMap, SubscriptionMap } from 'graphql-binding/dist/types';

export class OpenApi {
  static async init<TContext>(options: Options<TContext>) {
    const schema = await createSchema(options);
    return new Binding<QueryMap, SubscriptionMap>({ schema });
  }
}
