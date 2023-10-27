#!/usr/bin/env node

const Converter = require("../src/Converter");
const { program } = require("@caporal/core");
const fs = require("fs");
const path = require("path");

program
  .name("oas-to-k6-clients")
  .description("Convert OpenApi doc to k6 clients")
  .argument("<doc>", "OpenApi doc to convert")
  .option("-o --outputDir <outputDir>", "Output directory", { default: process.cwd() })
  .option("-b --basename <basename>", "The file basename no extension. Will use the basename of the doc if not specified.")
  .action(async ({ logger, args, options }) => {
    logger.info(`Converting '${args.doc}'`);
    const basename = options.basename?.length > 0 ? options.basename.replace(/[/\\?%*:|"<> ]/g, "") : path.basename(args.doc, path.extname(args.doc));
    const { typesSource, clientsSource } = await Converter.convert(args.doc);
    if (typesSource === undefined) {
      logger.warn("No type definitions to write.");
    } else {
      const filepath = path.join(options.outputDir, `${basename}.d.ts`);
      fs.writeFileSync(filepath, typesSource);
      logger.info(`Wrote k6 clients type definitions to ${filepath}`);
    }

    if (clientsSource === undefined) {
      logger.warn("No clients source to write.")
    }
    else {
      const filepath = path.join(options.outputDir, `${basename}.js`);
      fs.writeFileSync(filepath, clientsSource);
      logger.info(`Wrote k6 clients to ${filepath}`);
    }
  });

program.run();