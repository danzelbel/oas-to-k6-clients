const test = require("ava");
const SchemaConverter = require("../../src/SchemaConverter");
const SwaggerParser = require("@apidevtools/swagger-parser");

/**
 * toSource(schemas)
 */

// https://www.typescriptlang.org/docs/handbook/enums.html
test("enum type", async t => {
  const api = await composeDoc({
    HuntingSkill: {
      type: "string",
      enum: [
        "clueless",
        "lazy",
        "adventurous",
        "aggressive"
      ]
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export enum HuntingSkill {
  clueless,
  lazy,
  adventurous,
  aggressive
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md#schema
test("required property", async t => {
  const api = await composeDoc({
    Model: {
      type: "object",
      required: [
        "name"
      ],
      properties: {
        name: {
          type: "string"
        }
      }
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Model {
  name: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md#schema
test("optional property", async t => {
  const api = await composeDoc({
    Model: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Model {
  name?: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#simple-model
test("simple model", async t => {
  const api = await composeDoc({
    Model: {
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        address: {
          $ref: "#/components/schemas/Address"
        },
        age: {
          type: "integer"
        }
      }
    },
    Address: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Model {
  name?: string;
  address?: Address;
  age?: number;
}

export interface Address {
  name?: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#model-with-mapdictionary-properties
test("model with map string to string mapping", async t => {
  const api = await composeDoc({
    Model: {
      type: "object",
      additionalProperties: {
        type: "string"
      }
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Model {
  [key: string]: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#model-with-mapdictionary-properties
test("model with map string to model mapping", async t => {
  const api = await composeDoc({
    Foo: {
      type: "object",
      additionalProperties: {
        $ref: "#/components/schemas/ComplexModel"
      }
    },
    ComplexModel: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Foo extends ComplexModel {
}

export interface ComplexModel {
  name?: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#models-with-composition
test("model with composition", async t => {
  const api = await composeDoc({
    ErrorModel: {
      type: "object",
      properties: {
        message: {
          type: "string"
        },
        code: {
          type: "integer"
        }
      }
    },
    ExtendedErrorModel: {
      allOf: [
        {
          $ref: "#/components/schemas/ErrorModel"
        },
        {
          type: "object",
          properties: {
            rootCause: {
              type: "string"
            }
          }
        }
      ]
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface ErrorModel {
  message?: string;
  code?: number;
}

export interface ExtendedErrorModel extends ErrorModel {
  rootCause?: string;
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#models-with-composition
test("model with multiple reference composition", async t => {
  const api = await composeDoc({
    WarningModel: {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      }
    },
    ErrorModel: {
      type: "object",
      properties: {
        code: {
          type: "integer"
        }
      }
    },
    ExtendedErrorModel: {
      allOf: [
        {
          $ref: "#/components/schemas/WarningModel"
        },
        {
          $ref: "#/components/schemas/ErrorModel"
        }
      ]
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface WarningModel {
  message?: string;
}

export interface ErrorModel {
  code?: number;
}

export interface ExtendedErrorModel extends WarningModel, ErrorModel {
}`);
});

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#models-with-polymorphism-support
test("model with polymorphism support", async t => {
  const api = await composeDoc({
    Pet: {
      type: "object",
      discriminator: {
        propertyName: "petType"
      },
      properties: {
        name: {
          type: "string"
        },
        petType: {
          type: "string"
        }
      }
    },
    Cat: {
      description: "A representation of a cat. Note that `Cat` will be used as the discriminator value.",
      allOf: [
        {
          $ref: "#/components/schemas/Pet"
        },
        {
          type: "object",
          properties: {
            huntingSkill: {
              type: "string",
              description: "The measured skill for hunting",
              default: "lazy",
              enum: [
                "clueless",
                "lazy",
                "adventurous",
                "aggressive"
              ]
            }
          }
        }
      ]
    }
  });
  t.is(SchemaConverter.toSource(api.components.schemas), `export interface Pet {
  name?: string;
  petType?: string;
}

export interface Cat extends Pet {
  huntingSkill?: string;
}`);
});

function composeDoc(schemas) {
  const api = {
    openapi: "3.0.0",
    info: {
      title: "foo",
      version: "v1"
    },
    paths: {
      "/bar": {
        get: {
          responses: {
            200: {
              description: "Success"
            }
          }
        }
      }
    },
    components: {
      schemas
    }
  };
  return SwaggerParser.bundle(api);
}