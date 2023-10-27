const SwaggerParser = require("@apidevtools/swagger-parser");

/**
 * Validates an OpenAPI doc
 *
 * @param {(string|OpenAPI.Document)} api An OpenApi Object, or the file path or URL of your OpenApi doc.
 * @returns {Promise<OpenAPI.Document>}
 * @throws {Error}
 */
const validate = api => SwaggerParser.validate(api);

module.exports = validate;