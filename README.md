# directory-schema-validator

[![npm](https://img.shields.io/npm/v/@jpoehnelt/directory-schema-validator)](https://www.npmjs.com/package/@jpoehnelt/directory-schema-validator)
![Build](https://github.com/jpoehnelt/directory-schema-validator/workflows/Build/badge.svg)
![Release](https://github.com/jpoehnelt/directory-schema-validator/workflows/Release/badge.svg)
[![Docs](https://img.shields.io/badge/documentation-api-brightgreen)](https://jpoehnelt.github.io/directory-schema-validator/)

## Description

Validate directory structure and file contents with an extension of JSON schema.

## Install

Install using NPM or similar.

```sh
npm i directory-schema-validator
```

## Usage

```js
import {Validator, shorthandToJSONSchema} from 'directory-schema-validator';

// Helper function to generate JSON Schema from shorthand notation
const schema = shorthandToJSONSchema(['README.md']);

// the schema is the following object
{
  "type": "object",
  "properties": {
    "files": {
      "properties": {
        "README.md": {
          "type": "object"
        }
      },
      "type": "object",
      "required": [
        "README.md"
      ]
    }
  }
}

// instantiate validator and validate schema against a path
const validator = new Validator();
const valid = validator.validate(schema, '.');

if (!valid) {
    console.log(validator.errors);
}
```

This works by operating on a JSON object parsed from the file structure.

```js
import { parse } from 'directory-schema-validator';

parse('.');

{
  "path": "/workspaces/directory-schema-validator",
  "name": "directory-schema-validator",
  "size": 873,
  "type": "directory",
  "directories": {},
  "files": {
    "README.md": {
      "path": "/workspaces/directory-schema-validator/README.md",
      "name": "README.md",
      "size": 873,
      "type": "file",
      "extension": ".md"
    }
  }
}
```

See the [reference documentation](https://jpoehnelt.github.io/directory-schema-validator/) for more information about the structure of the JSON and signatures of each method.

> **Note**: Because this is JSONSchema, [composition](https://json-schema.org/understanding-json-schema/reference/combining.html#schema-composition) is allowed through keywords such as `allOf` or `oneOf`. 

## Custom keywords

This library makes the keyword `contents` available. This keyword validates  the contents of a file against an array of regex patterns.

```js
{
  "type": "object",
  "properties": {
    "files": {
      "properties": {
        "README.md": {
          // START CUSTOM KEYWORD
          "contents": [
            {
              "pattern": "directory-schema-validator",
              "flags": "i"
            }
          ],
          // END CUSTOM KEYWORD
          "type": "object"
        }
      },
      "type": "object",
      "required": [
        "README.md"
      ]
    }
  }
}
```

## Command line

Command line usage is available with the following commands: `validate`, `shorthand`, and `parse`. These commands correspond to the underlying interface.

```sh
npm install -g directory-schema-validator
directory-schema-validator --help
```

> **Note**: The shorthand command uses glob and looks for actual files unlike the programmatic interface which only uses the  strings.
