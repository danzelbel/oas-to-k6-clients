const Converter = require("./Converter");

module.exports = {
  oasToK6Client: (doc) => Converter.convert(doc),
  validate: require("./validate")
}