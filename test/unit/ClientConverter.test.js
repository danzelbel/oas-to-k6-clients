const test = require("ava");
const ClientConverter = require("../../src/ClientConverter");

/**
 * getJsDoc(verb, resource, operation)
 */

test("jsdoc no summary and descriptions", async t => {
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              nullable: true
            }
          }
        }
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @param [params=undefined] Request parameters.
   */`);
});

test("jsdoc with summary", async t => {
  const operation = {
    summary: "Update beer",
    responses: {
      200: {
        description: ""
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @summary Update beer
   * @param [params=undefined] Request parameters.
   */`);
});

test("jsdoc with desc", async t => {
  const operation = {
    description: "Updates a beer",
    responses: {
      200: {
        description: ""
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @description Updates a beer
   * @param [params=undefined] Request parameters.
   */`);
});

test("jsdoc with params desc", async t => {
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        description: "The id of the beer",
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        description: "The api-version to use",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    responses: {
      200: {
        description: ""
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @param id The id of the beer
   * @param apiVersion The api-version to use
   * @param [params=undefined] Request parameters.
   */`);
});

test("jsdoc with body desc", async t => {
  const operation = {
    requestBody: {
      description: "Changes to the beer",
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      200: {
        description: ""
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @param payload Changes to the beer
   * @param [params=undefined] Request parameters.
   */`);
});

test("jsdoc with response desc", async t => {
  const operation = {
    responses: {
      200: {
        description: "Latest copy of the beer",
        content: {
          "application/json": {
            schema: {
              nullable: true
            }
          }
        }
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @param [params=undefined] Request parameters.
   * @returns Latest copy of the beer
   */`);
});

test("jsdoc with summary, desc, params desc, body desc and response desc", async t => {
  const operation = {
    summary: "Update beer",
    description: "Updates a beer",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "The id of the beer",
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        description: "The api-version to use",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    requestBody: {
      description: "Changes to the beer",
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      200: {
        description: "Latest copy of the beer",
        content: {
          "application/json": {
            schema: {
              nullable: true
            }
          }
        }
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @summary Update beer
   * @description Updates a beer
   * @param id The id of the beer
   * @param apiVersion The api-version to use
   * @param payload Changes to the beer
   * @param [params=undefined] Request parameters.
   * @returns Latest copy of the beer
   */`);
});

test("jsdoc handles newline", async t => {
  const operation = {
    summary: "Update\nbeer",
    description: "Updates\na beer",
    responses: {
      200: {
        description: "Latest copy\nof the beer",
        content: {
          "application/json": {
            schema: {
              nullable: true
            }
          }
        }
      }
    }
  };
  t.is(ClientConverter.getJsDoc("put", "/beer/{id}", operation), `
  /**
   * PUT /beer/{id}
   * @summary Update
   * beer
   * @description Updates
   * a beer
   * @param [params=undefined] Request parameters.
   * @returns Latest copy
   * of the beer
   */`);
});

/**
 * getArgs(operation)
 * getUrl(resource, parameters)
 */

test("query arg", async t => {
  const operation = {
    parameters: [
      {
        name: "take",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["take?: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["take", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, "\n    const qs = `take=${take}`;");
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
});

test("query arg kebab-case", async t => {
  const operation = {
    parameters: [
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["apiVersion?: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["apiVersion", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, "\n    const qs = `api-version=${apiVersion}`;");
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
});

test("query arg kebab-case array", async t => {
  const operation = {
    parameters: [
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "array",
          nullable: true,
          items: {
            type: "string"
          }
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["apiVersion?: string[]", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["apiVersion", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, '\n    const qs = `api-version=${apiVersion.join("&api-version=")}`;');
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
});

test("path arg", async t => {
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["id: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["id", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer/{id}", operation.parameters);
  t.is(qs, "");
  t.is(url, "`${this.baseUrl}/beer/${id}`");
});

test("path arg kebab-case", async t => {
  const operation = {
    parameters: [
      {
        name: "api-version",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["apiVersion: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["apiVersion", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer/{api-version}", operation.parameters);
  t.is(qs, "");
  t.is(url, "`${this.baseUrl}/beer/${apiVersion}`");
});

test("path arg case mismatch", async t => {
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["id: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["id", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer/{ID}", operation.parameters);
  t.is(qs, "");
  t.is(url, "`${this.baseUrl}/beer/${id}`");
});

test("body arg", async t => {
  const operation = {
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    }
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["payload: any", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["payload", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, "");
  t.is(url, "`${this.baseUrl}/beer`");
});

test("body arg array", async t => {
  const operation = {
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "array",
            nullable: true,
            items: {
              type: "object"
            }
          }
        }
      }
    }
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["payload: any[]", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["payload", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, "");
  t.is(url, "`${this.baseUrl}/beer`");
});

test("path, query and body args", async t => {
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    }
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["id: number", "payload: any", "apiVersion?: number", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["id", "payload", "apiVersion", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer/{id}", operation.parameters);
  t.is(qs, "\n    const qs = `api-version=${apiVersion}`;");
  t.is(url, "`${this.baseUrl}/beer/${id}?${qs}`");
});

test("query args has array", async t => {
  const operation = {
    parameters: [
      {
        name: "take",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "style",
        in: "query",
        schema: {
          type: "array",
          nullable: true,
          items: {
            type: "string"
          }
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["take?: number", "style?: string[]", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["take", "style", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, '\n    const qs = `take=${take}&style=${style.join("&style=")}`;');
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
});

test("query args are arrays", async t => {
  const operation = {
    parameters: [
      {
        name: "tags",
        in: "query",
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      {
        name: "style",
        in: "query",
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, ["tags?: string[]", "style?: string[]", "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, ["tags", "style", "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, '\n    const qs = `tags=${tags.join("&tags=")}&style=${style.join("&style=")}`;');
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
});

test("query arg has default integer value", async t => await testParameterHasDefaultValue(t, { type: "integer", defaultValue: 1.1 }, { expectedType: "number", expectedValue: 1.1 }));
test("query arg has default string value", async t => await testParameterHasDefaultValue(t, { type: "string", defaultValue: "1.0" }, { expectedType: "string", expectedValue: '"1.0"' }));
test("query arg has default string value with double quotes", async t => await testParameterHasDefaultValue(t, { type: "string", defaultValue: '"pyrite" not gold' }, { expectedType: "string", expectedValue: '"\"pyrite\" not gold"' }));
test("query arg has default boolean value", async t => await testParameterHasDefaultValue(t, { type: "boolean", defaultValue: false }, { expectedType: "boolean", expectedValue: false }));

async function testParameterHasDefaultValue(t, { type, defaultValue }, { expectedType, expectedValue }) {
  const operation = {
    parameters: [
      {
        name: "random",
        in: "query",
        schema: {
          type,
          default: defaultValue
        }
      }
    ]
  };
  const { typedArgs, args } = ClientConverter.getArgs(operation);
  t.deepEqual(typedArgs, [`random?: ${expectedType}`, "params?: RefinedParams<RT> | null"]);
  t.deepEqual(args, [`random = ${expectedValue}`, "params = undefined"]);

  const { qs, url } = ClientConverter.getUrl("/beer", operation.parameters);
  t.is(qs, "\n    const qs = `random=${random}`;");
  t.is(url, "`${this.baseUrl}/beer?\${qs}`");
}

/**
 * getMethodCall(resource, operation, verb, typedArgs, args, retType)
 */

test("method name is operation id", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"],
    operationId: "beerCount"
  };
  const { typedMethod, method } = converter.getMethodCall("/beer/count", operation, "get", [], [], "");
  t.is(typedMethod, "beerCount<RT extends ResponseType | undefined>();");
  t.is(method, "beerCount()");
});

test("method name is operation name", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    tags: ["beer"]
  };
  const { typedMethod, method } = converter.getMethodCall("/beer", operation, "get", [], [], "");
  t.is(typedMethod, "get<RT extends ResponseType | undefined>();");
  t.is(method, "get()");
});

test("method name is operation name - with path param", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    tags: ["beer"]
  };
  const { typedMethod, method } = converter.getMethodCall("/beer/{id}", operation, "get", [], [], "");
  t.is(typedMethod, "get<RT extends ResponseType | undefined>();");
  t.is(method, "get()");
});

test("method name is in path - '/beer/count'", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"]
  };
  const { typedMethod, method } = converter.getMethodCall("/beer/count", operation, "get", [], [], "");
  t.is(typedMethod, "count<RT extends ResponseType | undefined>();");
  t.is(method, "count()");
});

test("method name is in path - '/beer/{id}/upload'", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"]
  };
  const { typedMethod, method } = converter.getMethodCall("/beer/{id}/upload", operation, "get", [], [], "");
  t.is(typedMethod, "upload<RT extends ResponseType | undefined>();");
  t.is(method, "upload()");
});

test("method name is in path - '/beer/style/{id}'", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"]
  };
  const { typedMethod, method } = converter.getMethodCall("/beer/style/{id}", operation, "get", [], [], "");
  t.is(typedMethod, "style<RT extends ResponseType | undefined>();");
  t.is(method, "style()");
});

test("method name exists with the same args", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"]
  };
  converter.getMethodCall("/beer/count", operation, "get", [], [], "");
  const { typedMethod, method } = converter.getMethodCall("/beer/count", operation, "get", [], [], "");
  t.is(typedMethod, "count2<RT extends ResponseType | undefined>();");
  t.is(method, "count2()");
});

test("method name exists but different args", t => {
  const converter = new ClientConverter("", undefined);
  const operation = {
    tags: ["beer"]
  };
  converter.getMethodCall("/beer/count", operation, "get", [], [], "");
  const { typedMethod, method } = converter.getMethodCall("/beer/count", operation, "get", ["take: number"], ["take"], "");
  t.is(typedMethod, "count<RT extends ResponseType | undefined>(take: number);");
  t.is(method, "count(take)");
});

/**
 * getBody(operation, verb)
 */

test("body is object", async t => {
  const operation = {
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    }
  };
  const { body, headers } = ClientConverter.getBody(operation, "post");
  t.is(body, "\n    const body = JSON.stringify(payload);");
  t.is(headers, "\n    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/json\" });");
});

test("body is application/json", async t => {
  const operation = {
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Beer"
          }
        }
      }
    }
  };
  const { body, headers } = ClientConverter.getBody(operation, "post");
  t.is(body, "\n    const body = JSON.stringify(beer);");
  t.is(headers, "\n    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/json\" });");
});

test("body is multipart/form-data", async t => {
  const operation = {
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string"
              }
            }
          }
        }
      }
    }
  };
  const { body, headers } = ClientConverter.getBody(operation, "post");
  t.is(body, "\n    const body = payload;");
  t.is(headers, "\n    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"multipart/form-data\" });");
});

test("body is application/octet-stream", async t => {
  const operation = {
    requestBody: {
      content: {
        "application/octet-stream": {
          schema: {
            type: "string",
            format: "binary"
          }
        }
      }
    }
  };
  const { body, headers } = ClientConverter.getBody(operation, "post");
  t.is(body, `
    const body = {
      file: http.file(binFile, undefined, "application/octet-stream")
    };`);
  t.is(headers, "\n    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/octet-stream\" });");
});

/**
 *  getK6Http(verb);
 */
test("verb get", async t => await testK6Http(t, "get", "http.get"));
test("verb head", async t => await testK6Http(t, "head", "http.head"));
test("verb options", async t => await testK6Http(t, "options", "http.options"));
test("verb patch", async t => await testK6Http(t, "patch", "http.patch"));
test("verb post", async t => await testK6Http(t, "post", "http.post"));
test("verb put", async t => await testK6Http(t, "put", "http.put"));
test("verb delete", async t => await testK6Http(t, "delete", "http.del"));

async function testK6Http(t, verb, expected) {
  t.is(ClientConverter.getK6Http(verb), expected);
}

/**
 * getCheck(tag, method, responses)
 */

test("response status check", async t => {
  const converter = new ClientConverter("beer", undefined);
  const responses = {
    200: {
      description: ""
    }
  };
  t.is(converter.getCheck("get()", responses), `
    check(res, {
      "BeerClient.get() 200": r => r.status === 200
    });`);
});

test("no response status check", async t => {
  const converter = new ClientConverter("beer", undefined);
  const responses = {
    default: {
      description: ""
    }
  };
  t.is(converter.getCheck("get()", responses), "");
});

/**
 * getReturn(responses)
 */

test("returns nothing", async t => {
  const converter = new ClientConverter("", undefined);
  const responses = {
    200: {
      description: ""
    }
  };
  const { retType, ret } = converter.getReturn(responses);
  t.is(retType, "");
  t.is(ret, "");
  t.is(converter.k6TypeNames.size, 0);
});

test("returns object", async t => {
  const converter = new ClientConverter("", undefined);
  const responses = {
    200: {
      content: {
        "application/json": {
          schema: {
            nullable: true
          }
        }
      }
    }
  };
  const { retType, ret } = converter.getReturn(responses);
  t.is(retType, ": { res: RefinedResponse<ResponseType | undefined>, json(): any }");
  t.is(ret, "\n    return { res, json: () => res.json() };");
  t.deepEqual(converter.k6TypeNames, new Set(["ResponseType", "RefinedResponse"]));
});

test("returns number", async t => {
  const converter = new ClientConverter("", undefined);
  const responses = {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "integer",
            format: "int32"
          }
        }
      }
    }
  };
  const { retType, ret } = converter.getReturn(responses);
  t.is(retType, ": { res: RefinedResponse<ResponseType | undefined>, json(): number }");
  t.is(ret, "\n    return { res, json: () => res.json() };");
  t.deepEqual(converter.k6TypeNames, new Set(["ResponseType", "RefinedResponse"]));
});

test("returns reference", async t => {
  const converter = new ClientConverter("", undefined);
  const responses = {
    200: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Beer"
          }
        }
      }
    }
  };
  const { retType, ret } = converter.getReturn(responses);
  t.is(retType, ": { res: RefinedResponse<ResponseType | undefined>, json(): Beer }");
  t.is(ret, "\n    return { res, json: () => res.json() };");
  t.deepEqual(converter.k6TypeNames, new Set(["ResponseType", "RefinedResponse"]));
});

test("returns array reference", async t => {
  const converter = new ClientConverter("", undefined);
  const responses = {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Beer"
            }
          }
        }
      }
    }
  };
  const { retType, ret } = converter.getReturn(responses);
  t.is(retType, ": { res: RefinedResponse<ResponseType | undefined>, json(): Beer[] }");
  t.is(ret, "\n    return { res, json: () => res.json() };");
  t.deepEqual(converter.k6TypeNames, new Set(["ResponseType", "RefinedResponse"]));
});

/**
 * getMethod(resource, verb, operation)
 */

test("method - no path, query, body and default response", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    responses: {
      default: {
        description: ""
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer", "options", operation);
  t.is(typeSource, `
  /**
   * OPTIONS /beer
   * @param [params=undefined] Request parameters.
   */
  options<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);`);
  t.is(source, `
  options(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.options(\`\${this.baseUrl}/beer\`, params);
  }`);
});

test("method - with path", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    responses: {
      default: {
        description: ""
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer/{id}", "get", operation);
  t.is(typeSource, `
  /**
   * GET /beer/{id}
   * @param [params=undefined] Request parameters.
   */
  get<RT extends ResponseType | undefined>(id: number, params?: RefinedParams<RT> | null);`);
  t.is(source, `
  get(id, params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(\`\${this.baseUrl}/beer/\${id}\`, params);
  }`);
});

test("method - with query", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    parameters: [
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    responses: {
      default: {
        description: ""
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer", "get", operation);
  t.is(typeSource, `
  /**
   * GET /beer
   * @param [params=undefined] Request parameters.
   */
  get<RT extends ResponseType | undefined>(apiVersion?: number, params?: RefinedParams<RT> | null);`);
  t.is(source, `
  get(apiVersion, params = undefined) {
    const qs = \`api-version=\${apiVersion}\`;
    params = Object.assign({}, this.params, params);
    const res = http.get(\`\${this.baseUrl}/beer?\${qs}\`, params);
  }`);
});

test("method - with body", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      default: {
        description: ""
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer", "post", operation);
  t.is(typeSource, `
  /**
   * POST /beer
   * @param [params=undefined] Request parameters.
   */
  post<RT extends ResponseType | undefined>(payload: any, params?: RefinedParams<RT> | null);`);
  t.is(source, `
  post(payload, params = undefined) {
    const body = JSON.stringify(payload);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/json\" });
    const res = http.post(\`\${this.baseUrl}/beer\`, body, params);
  }`);
});

test("method - with path, query and body", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      default: {
        description: ""
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer/{id}", "post", operation);
  t.is(typeSource, `
  /**
   * POST /beer/{id}
   * @param [params=undefined] Request parameters.
   */
  post<RT extends ResponseType | undefined>(id: number, payload: any, apiVersion?: number, params?: RefinedParams<RT> | null);`);
  t.is(source, `
  post(id, payload, apiVersion, params = undefined) {
    const qs = \`api-version=\${apiVersion}\`;
    const body = JSON.stringify(payload);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/json\" });
    const res = http.post(\`\${this.baseUrl}/beer/\${id}?\${qs}\`, body, params);
  }`);
});

test("method - with path, query, body and response", t => {
  const converter = new ClientConverter("beer", undefined);
  const operation = {
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          format: "int32"
        }
      },
      {
        name: "api-version",
        in: "query",
        schema: {
          type: "integer",
          format: "int32"
        }
      }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            nullable: true,
            oneOf: [
              {
                type: "object"
              }
            ]
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              nullable: true
            }
          }
        }
      }
    }
  };
  const { typeSource, source } = converter.getMethod("/beer/{id}", "post", operation);
  t.is(typeSource, `
  /**
   * POST /beer/{id}
   * @param [params=undefined] Request parameters.
   */
  post<RT extends ResponseType | undefined>(id: number, payload: any, apiVersion?: number, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): any };`);
  t.is(source, `
  post(id, payload, apiVersion, params = undefined) {
    const qs = \`api-version=\${apiVersion}\`;
    const body = JSON.stringify(payload);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { \"Content-Type\": \"application/json\" });
    const res = http.post(\`\${this.baseUrl}/beer/\${id}?\${qs}\`, body, params);
    check(res, {
      "BeerClient.post(id, payload, apiVersion, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }`);
});

/**
 * convert()
 */

test("convert", async t => {
  const paths = [{
    resource: "/beer",
    verb: "options",
    operation: {
      responses: {
        default: {
          description: ""
        }
      }
    }
  }];
  const converter = new ClientConverter("beer", paths);
  converter.convert();
  t.is(converter.typeSource, `export class BeerClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * OPTIONS /beer
   * @param [params=undefined] Request parameters.
   */
  options<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);
}`);
  t.is(converter.source, `export class BeerClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  options(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.options(\`\${this.baseUrl}/beer\`, params);
  }
}`);
});

test("convert - multiple methods", async t => {
  const paths = [
    {
      resource: "/beer",
      verb: "options",
      operation: {
        responses: {
          default: {
            description: ""
          }
        }
      }
    },
    {
      resource: "/beer",
      verb: "head",
      operation: {
        responses: {
          default: {
            description: ""
          }
        }
      }
    }];
  const converter = new ClientConverter("beer", paths);
  converter.convert();
  t.is(converter.typeSource, `export class BeerClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * OPTIONS /beer
   * @param [params=undefined] Request parameters.
   */
  options<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);

  /**
   * HEAD /beer
   * @param [params=undefined] Request parameters.
   */
  head<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);
}`);
  t.is(converter.source, `export class BeerClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  options(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.options(\`\${this.baseUrl}/beer\`, params);
  }

  head(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.head(\`\${this.baseUrl}/beer\`, params);
  }
}`);
});

test("convert - no extra import modules", async t => {
  const paths = [{
    resource: "/beer",
    verb: "options",
    operation: {
      responses: {
        default: {
          description: ""
        }
      }
    }
  }];
  const converter = new ClientConverter("beer", paths);
  converter.convert();
  t.deepEqual([...converter.k6TypeNames], ["RefinedParams", "ResponseType"]);
});

test("convert - import response types", async t => {
  const paths = [{
    resource: "/beer",
    verb: "get",
    operation: {
      responses: {
        default: {
          content: {
            "application/json": {
              schema: {
                nullable: true
              }
            }
          }
        }
      }
    }
  }];
  const converter = new ClientConverter("beer", paths);
  converter.convert();
  t.deepEqual([...converter.k6TypeNames], ["RefinedParams", "ResponseType", "RefinedResponse"]);
});