const test = require("ava");
const { validate, oasToK6Client } = require("../../src/index");

const api = {
  openapi: "3.0.3",
  info: {
    title: "Watering Hole",
    version: "1.0.0"
  },
  paths: {
    "/beer": {
      get: {
        tags: ["beer"],
        responses: {
          default: {
            description: ""
          }
        }
      }
    }
  }
};

/**
 * oasToK6Client(doc)
 */

test("cannot convert invalid openapi doc", async t => {
  const api = {
    openapi: "3.0.3"
  };
  await t.throwsAsync(async () => await oasToK6Client(api), { message: "[object Object] is not a valid Openapi API definition" });
});

test("can convert", async t => {
  const { typesSource, clientsSource } = await oasToK6Client(api);
  t.is(typesSource, `// Generator: oas-to-k6-clients

import { RefinedParams, ResponseType } from "k6/http";

export class BeerClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * GET /beer
   * @param [params=undefined] Request parameters.
   */
  get<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);
}`);

  t.is(clientsSource, `// Generator: oas-to-k6-clients

import http from "k6/http";
import { check } from "k6";

export class BeerClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  get(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(\`\${this.baseUrl}/beer\`, params);
  }
}`);
});

/**
 * validate(api)
 */

test("valid openapi doc", async t => {
  await t.notThrowsAsync(async () => await validate(api));
});

test("invalid openapi doc", async t => {
  const api = {
    openapi: "3.0.3"
  };
  await t.throwsAsync(async () => await validate(api), { message: "[object Object] is not a valid Openapi API definition" });
});