/**
 * Capitalizes the first letter of the string.
 *
 * @param {string} text
 * @returns {string}
 */
String.prototype.capitalizeFirstLetter = function () {
  return `${this.charAt(0).toUpperCase()}${this.slice(1)}`;
}

/**
 * Converts string to camel casing.
 * @example
 * // returns apiVersion
 * "ApiVersion".toCamelCase();
 * @example
 * // returns apiVersion
 * "api-version".toCamelCase();
 * @example
 * // returns apiVersion
 * "api_version".toCamelCase();
 *
 * @param {string} text
 * @returns {string}
 */
String.prototype.toCamelCase = function () {
  const regex = new RegExp("[\-_]", "g");
  if (regex.test(this)) {
    return this
      .toLowerCase()
      .trim()
      .split(regex)
      .reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));
  } else {
    return `${this.charAt(0).toLowerCase()}${this.slice(1)}`;
  }
}

/**
 * Splits a string by newline.
 *
 * @param {string} text
 * @returns {string[]}
 */
String.prototype.splitByNewline = function () {
  return this
    .replace("\r\n", "\n")
    .replace("\r", "\n")
    .split('\n')
}