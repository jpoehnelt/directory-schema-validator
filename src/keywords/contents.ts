/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  _,
  KeywordCxt,
  KeywordDefinition,
  KeywordErrorDefinition,
  Code,
  str,
} from "ajv";
import { KeywordErrorCxt } from "ajv/dist/types";
import fs from "fs";
import { JSONSchema7 } from "json-schema";

const metaSchema: JSONSchema7 = {
  type: "array",
  items: {
    type: "object",
    required: ["pattern"],
    properties: { pattern: { type: "string" }, flags: { type: "string" } },
  },
  minItems: 1,
};

interface Schema {
  pattern: string;
  flags?: string;
}

const schemaToRegex = ({ pattern, flags }: Schema): RegExp =>
  new RegExp(pattern, flags);

const error: KeywordErrorDefinition = {
  message: () => "file contents do not match pattern(s)",
  params: ({ schema, data }) =>
    _`{file: ${data}.path, patterns: ${schema.map(schemaToRegex)}}`,
};

export const contents: KeywordDefinition = {
  keyword: "contents",
  type: "object",
  metaSchema,
  error,
  compile: (schema) => (data) => {
    const contents = fs.readFileSync(data.path, "utf-8");

    return schema.every((s: Schema) => {
      const regex = schemaToRegex(s);
      return regex.test(contents);
    });
  },
};
