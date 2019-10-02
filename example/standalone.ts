import { CallBackendArguments } from "swagger-to-graphql";
import { OpenApi } from "../dist";
import fetch from 'node-fetch';

async function callBackend({
                             requestOptions: { method, body, baseUrl, path, query, headers },
                           }: CallBackendArguments<{}>) {
  const url = `${baseUrl}${path}?${new URLSearchParams(query as any)}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (200 <= response.status && response.status < 300) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
  throw new Error(`Response: ${response.status} - ${text}`);
}

OpenApi.init({
  swaggerSchema: require.resolve('./petstore.json'),
  callBackend
}).then(binding => {
  binding.query.findPetsByStatus({ status: "available" }, {}, '{ id name }').then(
    res => console.log(res))
});
