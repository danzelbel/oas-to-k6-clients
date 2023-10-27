[![MIT License](https://img.shields.io/github/license/danzelbel/oas-to-k6-clients)](https://github.com/danzelbel/oas-to-k6-clients/blob/main/LICENSE)
![Build](https://github.com/danzelbel/oas-to-k6-clients/actions/workflows/build.yml/badge.svg)
![Release](https://github.com/danzelbel/oas-to-k6-clients/actions/workflows/release.yml/badge.svg)
![NPM Version](https://img.shields.io/npm/v/oas-to-k6-clients.svg)
![NPM Weekly Downloads](https://img.shields.io/npm/dw/oas-to-k6-clients.svg)

# oas-to-k6-clients

Convert [OpenApi](https://github.com/OAI/OpenAPI-Specification) doc to [k6](https://docs.k6.io/docs) client.

Uses [swagger-parser](https://github.com/APIDevTools/swagger-parser) to validate/parse a OpenAPI 3.0 file.

## Installation

```shell
$ npm i oas-to-k6-clients
```

## Usage

### CLI

```shell
$ npx oas-to-k6-clients petstore.yaml -o .
```

### Library

Convert

```js
const fs = require("fs");
const { oasToK6Client } = require("oas-to-k6-clients");

async function run() {
  const { typesSource, clientsSource } = await oasToK6Client("oas.yaml");
  fs.writeFileSync("./index.d.ts", typesSource);
  fs.writeFileSync("./index.js", clientsSource);
}
```

#### Validate

Validates the OpenApi doc against the [OpenAPI 3.0 Schema](https://github.com/OAI/OpenAPI-Specification/blob/main/schemas/v3.0/schema.json).

```js
const { validate } = require("oas-to-k6-clients");

try {
  validate("oas.yaml");
} catch (error) {
  // Handle invalid oas doc
}
```

## Example

Using [wateringhole.yaml](/test/e2e/wateringhole.yaml)

Types source output - [wateringhole.d.ts](/test/e2e/wateringhole.d.ts)

Clients source output - [wateringhole.js](/test/e2e/wateringhole.js)