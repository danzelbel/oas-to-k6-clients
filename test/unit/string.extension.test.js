const test = require("ava");
require("../../src/string.extensions");

/**
 * capitalizeFirstLetter()
 */

test("capitalizes the first letter", t => {
  t.is("capitalized".capitalizeFirstLetter(), "Capitalized");
});

/**
 * toCamelCase()
 */

test("converts TitleCase to camelCase", t => {
  t.is("ApiVersion".toCamelCase(), "apiVersion");
});

test("converts kebab-case to camelCase", t => {
  t.is("api-version".toCamelCase(), "apiVersion");
});

test("converts snake_case to camelCase", t => {
  t.is("api_version".toCamelCase(), "apiVersion");
});

/**
 * splitByNewline()
 */

test("splits a string by CR-LF", t => {
  t.deepEqual("first\r\nsecond".splitByNewline(), ["first", "second"]);
});

test("splits a string by LF", t => {
  t.deepEqual("first\nsecond".splitByNewline(), ["first", "second"]);
});