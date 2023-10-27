const SwaggerParser = require("@apidevtools/swagger-parser");
const ClientConverter = require("./ClientConverter");
const SchemaConverter = require("./SchemaConverter");

/**
 * Converts OpenApi doc to k6 clients
 */
class Converter {
  /**
   * @param {(string|OpenAPI.Document)} api An OpenApi Object, or the file path or URL of your OpenApi doc.
   * @returns {Promise<{typesSource: string, clientsSource: string}>} The types source and clients source.
   */
  static async convert(doc) {
    const api = await SwaggerParser.bundle(doc);
    const k6TypeNames = new Set();
    const allTypeSource = [];
    const allClientSource = [];
    const tagGroups = Converter.groupByTag(api.paths);
    for (const tag in tagGroups) {
      const paths = tagGroups[tag];
      const converter = new ClientConverter(tag, paths);
      converter.convert();
      if (converter.k6TypeNames.size > 0) {
        converter.k6TypeNames.forEach(t => k6TypeNames.add(t));
      }
      allTypeSource.push(converter.typeSource);
      allClientSource.push(converter.source);
    }

    if (api.components !== undefined) {
      allTypeSource.push(`${SchemaConverter.toSource(api.components?.schemas)}`);
    }
    if (k6TypeNames.size > 0) {
      allTypeSource.unshift(`import { ${[...k6TypeNames].join(", ")} } from "k6/http";`);
    }

    const typesSource = `// Generator: oas-to-k6-clients

${allTypeSource.join("\n\n")}`;

    const clientsSource = `// Generator: oas-to-k6-clients

import http from "k6/http";
import { check } from "k6";

${allClientSource.join("\n\n")}`;

    return { typesSource, clientsSource };
  }

  /**
   * Groups paths using first tag.
   *
   * @param {OpenAPIV3.PathsObject<{}, {}>} paths
   * @returns {{[name: string]: {resource: string, verb: string, operation: Object}[]}}
   */
  static groupByTag(paths) {
    const groups = {};
    for (const resource in paths) {
      const pathItem = paths[resource];
      for (const verb in pathItem) {
        const operation = pathItem[verb];
        const tag = operation.tags[0];
        if (!groups.hasOwnProperty(tag)) {
          groups[tag] = [];
        }
        groups[tag].push({ resource, verb, operation });
      }
    }
    return groups;
  }
}

module.exports = Converter;