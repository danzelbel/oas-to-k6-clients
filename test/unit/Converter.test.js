const test = require("ava");
const Converter = require("../../src/Converter");

/**
 * groupByTag(paths)
 */

test("group by tag - all duplicate tags", async t => {
  const paths = {
    "/beer": {
      get: {
        tags: ["beer"]
      }
    },
    "/beer/count": {
      head: {
        tags: ["beer"]
      }
    }
  };
  const groups = Converter.groupByTag(paths);
  t.is(Object.keys(groups).length, 1);
  t.true(groups.hasOwnProperty("beer"));
  t.is(groups["beer"].length, 2);

  let p = groups["beer"][0];
  t.is(p.resource, "/beer");
  t.is(p.verb, "get");

  p = groups["beer"][1];
  t.is(p.resource, "/beer/count");
  t.is(p.verb, "head");
});

test("group by tag - all unique tags", async t => {
  const paths = {
    "/beer": {
      get: {
        tags: ["beer"],
      }
    },
    "/user": {
      get: {
        tags: ["user"],
      }
    }
  };
  const groups = Converter.groupByTag(paths);
  t.is(Object.keys(groups).length, 2);
  t.true(groups.hasOwnProperty("beer"));
  t.is(groups["beer"].length, 1);

  let p = groups["beer"][0];
  t.is(p.resource, "/beer");
  t.is(p.verb, "get");

  t.true(groups.hasOwnProperty("user"));
  t.is(groups["user"].length, 1);

  p = groups["user"][0];
  t.is(p.resource, "/user");
  t.is(p.verb, "get");
});

test("group by tag - duplicate and unique tags", async t => {
  const paths = {
    "/beer": {
      get: {
        tags: ["beer"]
      }
    },
    "/beer/count": {
      head: {
        tags: ["beer"]
      }
    },
    "/user": {
      get: {
        tags: ["user"],
      }
    }
  };
  const groups = Converter.groupByTag(paths);
  t.is(Object.keys(groups).length, 2);
  t.true(groups.hasOwnProperty("beer"));
  t.is(groups["beer"].length, 2);

  let p = groups["beer"][0];
  t.is(p.resource, "/beer");
  t.is(p.verb, "get");

  p = groups["beer"][1];
  t.is(p.resource, "/beer/count");
  t.is(p.verb, "head");

  t.true(groups.hasOwnProperty("user"));
  t.is(groups["user"].length, 1);

  p = groups["user"][0];
  t.is(p.resource, "/user");
  t.is(p.verb, "get");
});

/**
 * convert(doc)
 */

test("cannot convert invalid openapi doc", async t => {
  const api = {
    openapi: "3.0.0"
  };
  await t.throwsAsync(async () => await Converter.convert(api), { message: "[object Object] is not a valid Openapi API definition" });
});

test("convert", async t => {
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
  const { typesSource, clientsSource } = await Converter.convert(api);
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

test("convert doc with multiple groups", async t => {
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
      },
      "/user": {
        get: {
          tags: ["user"],
          responses: {
            default: {
              description: ""
            }
          }
        }
      }
    }
  };
  const { typesSource, clientsSource } = await Converter.convert(api);
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
}

export class UserClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * GET /user
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
}

export class UserClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  get(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(\`\${this.baseUrl}/user\`, params);
  }
}`);
});