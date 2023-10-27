const test = require("ava");
const path = require("path");
const fs = require("fs");
const Converter = require("../../src/Converter");

test("convert", async t => {
  const dir = path.join(process.cwd(), "test", "e2e");
  const expectedTypesSource = fs.readFileSync(path.join(dir, "expected-types.d.ts")).toString().replaceAll("\r\n", "\n");
  const expectedClientsSource = fs.readFileSync(path.join(dir, "expected-clients.js")).toString().replaceAll("\r\n", "\n");
  const { typesSource, clientsSource } = await Converter.convert(path.join(dir, "wateringhole.yaml"));
  t.is(typesSource, expectedTypesSource);
  t.is(clientsSource, expectedClientsSource);
});