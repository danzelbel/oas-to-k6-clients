require("./string.extensions");
const { getTypeName, getReferenceName } = require("./common");

/**
 * Converts the paths to k6 clients with typescript definitions.
 */
class ClientConverter {
  #tag;
  #paths;
  /** @type {{[name: string]: number}} */
  #uniqueMethods = {};
  k6TypeNames = new Set();
  typeSource;
  source;

  /**
   * @param {string} tag
   * @param {{resource: string, verb: string, operation: Object}[]} paths
   */
  constructor(tag, paths) {
    this.#tag = tag;
    this.#paths = paths;
  }

  convert() {
    const tag = this.#tag.capitalizeFirstLetter();
    const typeSources = [];
    const methods = [];
    this.k6TypeNames.add("RefinedParams");
    this.k6TypeNames.add("ResponseType");
    this.#paths.forEach(p => {
      const m = this.getMethod(p.resource, p.verb, p.operation);
      typeSources.push(m.typeSource);
      methods.push(m.source);
    });

    this.typeSource = `export class ${tag}Client {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);
${typeSources.join("\n")}
}`;
    this.source = `export class ${tag}Client {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }
${methods.join("\n")}
}`;
  }

  /**
   * @param {string} resource
   * @param {OpenAPIV3.PathItemObject<{}>} pathItem
   */
  getMethod(resource, verb, operation) {
    const jsdoc = ClientConverter.getJsDoc(verb, resource, operation);
    const { retType, ret } = this.getReturn(operation.responses);
    const { typedArgs, args } = ClientConverter.getArgs(operation);
    const { typedMethod, method } = this.getMethodCall(resource, operation, verb, typedArgs, args, retType);
    const typeSource = `${jsdoc}
  ${typedMethod}`;

    const { qs, url } = ClientConverter.getUrl(resource, operation.parameters);
    const { body, headers } = ClientConverter.getBody(operation, verb);
    const http = ClientConverter.getK6Http(verb);
    const check = this.getCheck(method, operation.responses);
    const source = `
  ${method} {${qs}${body}
    params = Object.assign({}, this.params, params);${headers}
    const res = ${http}(${url}, ${body !== "" ? "body, " : ""}params);${check}${ret}
  }`;

    return { typeSource, source };
  }

  static getJsDoc(verb, resource, operation) {
    const comments = [];
    comments.push(`   * ${verb.toUpperCase()} ${resource}`);
    if (operation.summary?.length > 0) {
      comments.push(`@summary ${operation.summary.splitByNewline().join("\n   * ")}`);
    }
    if (operation.description?.length > 0) {
      comments.push(`@description ${operation.description.splitByNewline().join("\n   * ")}`);
    }

    operation.parameters?.forEach(p => {
      const name = p.name;
      const validName = name.toCamelCase();
      switch (p.in) {
        case "query": // Falls through
        case "path":
          let defaultValue = "";
          if (p.schema.default !== undefined) {
            defaultValue = typeof (p.schema.default) === "string" ? `"${p.schema.default.replaceAll('"', "\"")}"` : p.schema.default.toString();
          }

          if (defaultValue.length > 0 && p.description === undefined) {
            comments.push(`@param [${validName}=${defaultValue}]`);
          } else if (defaultValue.length > 0 && p.description.length > 0) {
            comments.push(`@param [${validName}=${defaultValue}] ${p.description.splitByNewline().join("\n   * ")}`);
          } else if (p.description?.length > 0) {
            comments.push(`@param ${validName} ${p.description.splitByNewline().join("\n   * ")}`);
          }
          break;
        case "header":
          break;
        case "cookie":
          break;
        default:
          throw new ArgumentOutOfRangeException();
      }
    });

    if (operation.requestBody) {
      let name = "payload";
      const content = operation.requestBody.content;
      if (content.hasOwnProperty("application/json")) {
        const schema = content["application/json"].schema;
        const refName = schema.$ref ? getReferenceName(schema.$ref) : undefined;
        name = refName?.toCamelCase() ?? name;
      }
      else if (content.hasOwnProperty("application/octet-stream")) {
        name = "binFile";
      }
      // TODO: ADD MORE REQUEST BODY CONTENT type HERE WHEN NEEDED

      if (operation.requestBody.description?.length > 0) {
        comments.push(`@param ${name} ${operation.requestBody.description.splitByNewline().join("\n   * ")}`);
      }
    }

    comments.push("@param [params=undefined] Request parameters.");

    const responses = operation.responses;
    const status = Object.keys(responses)[0] === "default" && Object.keys(responses).length > 1
      ? Object.keys(responses)[1]
      : Object.keys(responses)[0];
    const response = responses[status];
    if (response.description?.length > 0) {
      comments.push(`@returns ${response.description.splitByNewline().join("\n   * ")}`);
    }

    return `
  /**
${comments.join("\n   * ")}
   */`;
  }

  static getArgs(operation) {
    const reqTypedArgs = [];
    const optTypedArgs = [];
    const reqArgs = [];
    const optArgs = [];

    operation.parameters?.forEach(p => {
      const name = p.name.toCamelCase();
      const type = getTypeName(p.schema);
      if (p.required) {
        reqTypedArgs.push(`${name}: ${type}`);
        reqArgs.push(name);
      } else {
        optTypedArgs.push(`${name}?: ${type}`);
        if (p.schema.default !== undefined) {
          const defaultValue = typeof (p.schema.default) === "string"
            ? `"${p.schema.default.replaceAll('"', "\"")}"`
            : p.schema.default.toString();
          optArgs.push(`${name} = ${defaultValue}`);
        } else {
          optArgs.push(name);
        }
      }
    });

    optTypedArgs.push("params?: RefinedParams<RT> | null");
    optArgs.push("params = undefined");

    if (operation.requestBody) {
      let name = "payload";
      let type = "any";
      const content = operation.requestBody.content;
      if (content.hasOwnProperty("application/json")) {
        const schema = content["application/json"].schema;
        const refName = schema.$ref ? getReferenceName(schema.$ref) : undefined;
        name = refName?.toCamelCase() ?? name;
        type = getTypeName(schema);
      }
      else if (content.hasOwnProperty("multipart/form-data")) {
        type = getTypeName(content["multipart/form-data"].schema);
      }
      else if (content.hasOwnProperty("application/octet-stream")) {
        name = "binFile";
        type = "ArrayBuffer";
      }
      // TODO: ADD MORE REQUEST BODY CONTENT type HERE WHEN NEEDED

      reqTypedArgs.push(`${name}: ${type}`);
      reqArgs.push(name);
    }

    const typedArgs = [...reqTypedArgs, ...optTypedArgs];
    const args = [...reqArgs, ...optArgs];
    return { typedArgs, args };
  }

  getMethodCall(resource, operation, verb, typedArgs, args, retType) {
    /** @type {string} */
    let methodName = operation.operationId;
    if (methodName === undefined) {
      const chunks = resource.split("/").filter(c => !c.startsWith("{"));
      methodName = chunks[chunks.length - 1];
      if (methodName === this.#tag) {
        methodName = verb;
      }
    }

    methodName = methodName.toCamelCase();
    let method = `${methodName}(${args.join(", ")})`;
    if (this.#uniqueMethods.hasOwnProperty(method)) {
      methodName = `${methodName}${++this.#uniqueMethods[method]}`;
    } else {
      this.#uniqueMethods[method] = 1;
    }

    const typedMethod = `${methodName}<RT extends ResponseType | undefined>(${typedArgs.join(", ")})${retType};`;
    return { typedMethod, method };
  }

  static getBody(operation, verb) {
    let headers = "";
    let body = "";
    if (operation.requestBody) {
      let name = "payload";
      const content = operation.requestBody.content;
      if (content.hasOwnProperty("application/json")) {
        const schema = content["application/json"].schema;
        const refName = schema.$ref ? getReferenceName(schema.$ref) : undefined;
        name = refName?.toCamelCase() ?? name;
        body = `
    const body = JSON.stringify(${name});`;
        headers = ", { \"Content-Type\": \"application/json\" }";
      }
      else if (content.hasOwnProperty("multipart/form-data")) {
        body = `
    const body = ${name};`;
        headers = ", { \"Content-Type\": \"multipart/form-data\" }";
      }
      else if (content.hasOwnProperty("application/octet-stream")) {
        body = `
    const body = {
      file: http.file(binFile, undefined, "application/octet-stream")
    };`;
        headers = ", { \"Content-Type\": \"application/octet-stream\" }";
      }
      // TODO: ADD MORE REQUEST BODY CONTENT type HERE WHEN NEEDED
    }
    if (headers.length > 0) {
      headers = `
    params.headers = Object.assign({}, params.headers${headers});`;
    }
    const opTypesWithBody = ["delete", "patch", "post", "put"];
    if (body === "" && opTypesWithBody.includes(verb.toLowerCase())) {
      body = `
    const body = undefined;`;
    }

    return { body, headers };
  }

  static getUrl(resource, parameters) {
    const pairs = [];
    parameters?.forEach(p => {
      const name = p.name;
      const validName = name.toCamelCase();
      switch (p.in) {
        case "query":
          pairs.push(p.schema.type === "array"
            ? `${name}=\${${validName}.join("&${name}=")}`
            : `${name}=\${${validName}}`);
          break;
        case "path":
          if (!name.includes("-") && resource.includes(`{${name}}`)) break;
          resource = resource.replace(new RegExp(`{${name}}`, "i"), `{${validName}}`);
          break;
        case "header":
          break;
        case "cookie":
          break;
        default:
          throw new ArgumentOutOfRangeException();
      }
    });

    const qs = !pairs.length > 0 ? "" : `
    const qs = \`${pairs.join("&")}\`;`;
    const url = `\`\${this.baseUrl}${resource.replaceAll("{", "${")}${pairs.length > 0 ? "?${qs}" : ""}\``;
    return { qs, url };
  }

  static getK6Http(verb) {
    verb = verb == "delete" ? "del" : verb.toLowerCase();
    return `http.${verb}`;
  }

  getCheck(method, responses) {
    let status = Object.keys(responses)[0];
    if (status === "default") return "";
    return `
    check(res, {
      "${this.#tag.capitalizeFirstLetter()}Client.${method.replaceAll("\"", "'")} ${status}": r => r.status === ${status}
    });`
  }

  getReturn(responses) {
    let retType = "";
    let ret = "";

    /**
     * Each operation must have at least one response defined, usually a successful response.
     * Assumes that responses are in ascending order
     *   1. Informational responses (100 – 199)
     *   2. Successful responses (200 – 299)
     *   3. Redirection messages (300 – 399)
     *   4. Client error responses (400 – 499)
     *   5. Server error responses (500 – 599)
     *   6. default
     */
    const status = Object.keys(responses)[0] === "default" && Object.keys(responses).length > 1
      ? Object.keys(responses)[1]
      : Object.keys(responses)[0];
    const response = responses[status];

    if (response.content) {
      const mediaTypeName = Object.keys(response.content)[0];
      const mediaType = response.content[mediaTypeName];
      const type = getTypeName(mediaType.schema);
      this.k6TypeNames.add("ResponseType");
      this.k6TypeNames.add("RefinedResponse");
      retType = `: { res: RefinedResponse<ResponseType | undefined>, json(): ${type} }`;
      ret = `
    return { res, json: () => res.json() };`;
    }
    return { retType, ret };
  }
}

module.exports = ClientConverter;