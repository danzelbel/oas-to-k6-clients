/**
 * Converts the schema type to typescript type.
 *
 * @param {Object} schema
 * @returns {string} The typescript type
 */
function getTypeName(schema) {
  if (schema.$ref !== undefined) {
    return getReferenceName(schema.$ref);
  }
  switch (schema.type) {
    case undefined: return "any";
    case "integer": return "number";
    case "object": return "any";
    case "array": return `${getTypeName(schema.items)}[]`;
    default: return schema.type;
  }
}

/**
 * Gets the schema reference name.
 *
 * @param {string} $ref The schema reference
 * @returns {string} The name of the reference
 */
const getReferenceName = $ref => $ref.substring($ref.lastIndexOf("/") + 1);

module.exports = {
  getTypeName,
  getReferenceName
}