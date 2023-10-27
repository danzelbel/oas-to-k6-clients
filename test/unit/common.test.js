const test = require("ava");
const { getTypeName, getReferenceName, getMethodName } = require("../../src/common");

/**
 * getTypeName(schema)
 */

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean
test("int32 property", t => t.is(getTypeName({ type: "number", format: "int32" }), "number"));
test("int64 property", t => t.is(getTypeName({ type: "number", format: "int64" }), "number"));
test("float property", t => t.is(getTypeName({ type: "number", format: "float" }), "number"));
test("double property", t => t.is(getTypeName({ type: "number", format: "double" }), "number"));
test("string property", t => t.is(getTypeName({ type: "string" }), "string"));
test("byte property", t => t.is(getTypeName({ type: "string", format: "byte" }), "string"));
test("binary property", t => t.is(getTypeName({ type: "string", format: "binary" }), "string"));
test("boolean property", t => t.is(getTypeName({ type: "boolean" }), "boolean"));
test("date property", t => t.is(getTypeName({ type: "string", format: "byte" }), "string"));
test("datetime property", t => t.is(getTypeName({ type: "string", format: "date-time" }), "string"));
test("password property", t => t.is(getTypeName({ type: "string", format: "password" }), "string"));

// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
test("object property", t => t.is(getTypeName({ type: "object" }), "any"));

test("reference property", t => t.is(getTypeName({ $ref: "#/components/schemas/Beer" }), "Beer"));

// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
test("array property", t => t.is(getTypeName({ type: "array", items: { type: "object" } }), "any[]"));
test("array reference property", t => t.is(getTypeName({ type: "array", items: { $ref: "#/components/schemas/Beer" } }), "Beer[]"));
test("array integer property", t => t.is(getTypeName({ type: "array", items: { type: "integer" } }), "number[]"));
test("array string property", t => t.is(getTypeName({ type: "array", items: { type: "string" } }), "string[]"));
test("array boolean property", t => t.is(getTypeName({ type: "array", items: { type: "boolean" } }), "boolean[]"));

/**
 * getReferenceName($ref)
 */

test("reference name", t => t.is(getReferenceName("#/components/schemas/Beer"), "Beer"));