const { getTypeName, getReferenceName } = require("./common");

class SchemaConverter {
  /**
   * Converts the schemas to a typescript definitions.
   *
   * @param {Object} schemas
   * @returns {string} The type definitions code
   */
  static toSource(schemas) {
    const allCodes = [];
    for (const name in schemas) {
      const schema = schemas[name];
      const code = schema.enum !== undefined ? this.#toEnum(name, schema) : this.#toInterface(name, schema);
      allCodes.push(code);
    }
    return allCodes.join(`\n\n`);
  }

  /**
   * Converts a schema to an typescript enum.
   *
   * @param {string} name The name of the schema
   * @param {Object} schema
   * @returns {string} The enum code
   */
  static #toEnum(name, schema) {
    const values = schema.enum.map(value => `  ${value}`).join(`,\n`);
    return `export enum ${name} {
${values}
}`
  }

  /**
   * Converts a schema to an typescript interface.
   *
   * @param {string} name The name of the schema
   * @param {Object} schema
   * @returns {string} The interface code
   */
  static #toInterface(name, schema) {
    const allProps = [];
    const extendInterfaces = [];

    /* Model with composition
     *
     * allOf:
     * - $ref: '#/components/schemas/ErrorModel'
     * - type: object
     *   properties:
     *     rootCause:
     *       type: string
     */
    if (schema.allOf !== undefined) {
      extendInterfaces.push(...schema.allOf.filter(s => s.$ref !== undefined).map(s => getReferenceName(s.$ref)));

      schema.allOf.filter(s => s.$ref === undefined).forEach(subschema => {
        const { extendInterface, props } = this.#getProperties(subschema);
        if (extendInterface !== undefined) extendInterfaces.push(extendInterface);
        if (props.length > 0) allProps.push(...props);
      });
    } else {
      const { extendInterface, props } = this.#getProperties(schema);
      if (extendInterface !== undefined) extendInterfaces.push(extendInterface);
      if (props.length > 0) allProps.push(...props);
    }

    const extendsStr = extendInterfaces.length > 0 ? ` extends ${extendInterfaces.join(", ")}` : "";
    const propsStr = allProps.length > 0 ? `\n${allProps.join("\n")}` : "";

    return `export interface ${name}${extendsStr} {${propsStr}
}`;
  }

  /**
   * Converts the schema properties to typescript properties.
   *
   * @param {Object} schema
   * @returns {{extendInterface: string, props: string[]}} The extend interface and properties code
   */
  static #getProperties(schema) {
    const props = [];
    let extendInterface;
    const isOptional = key => schema.required !== undefined && schema.required.includes(key) ? "" : "?";

    /* Simple model
     *
     * name:
     *   type: string
     * address:
     *   $ref: '#/components/schemas/Address'
     */
    for (const name in schema.properties) {
      const prop = schema.properties[name];
      props.push(`  ${name}${isOptional(name)}: ${getTypeName(prop)};`);
    }

    if (schema.additionalProperties !== undefined) {
      /* Model with map - string to string mapping
       *
       * additionalProperties:
       *   type: string
       */
      if (schema.additionalProperties.type === "string") {
        props.push("  [key: string]: string;");
      }

      /* Model with map - string to model mapping
       *
       * additionalProperties:
       *   $ref: '#/components/schemas/ComplexModel'
       */
      else if (schema.additionalProperties.$ref !== undefined) {
        extendInterface = getReferenceName(schema.additionalProperties.$ref);
      }
    }
    return { extendInterface, props };
  }
}

module.exports = SchemaConverter;