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
import _ from "lodash";
import Ajv from "ajv";
import { contents } from "./contents";
import path from "path";

test("contents is valid", () => {
  const ajv = new Ajv();
  ajv.addKeyword(contents);

  const validate = ajv.compile({
    type: "object",
    contents: [{ pattern: "^FOO=1$", flags: "i" }],
    properties: { path: { type: "string" }, name: { type: "string" } },
  });

  const valid = validate({
    path: path.join(__dirname, "..", "__fixtures__", "baz", "foo.txt"),
  });
  expect(valid).toBe(true);
});

test("contents is not valid", () => {
  const ajv = new Ajv();
  ajv.addKeyword(contents);

  const validate = ajv.compile({
    type: "object",
    contents: [{ pattern: "^FOO=1$" }],
    properties: { path: { type: "string" }, name: { type: "string" } },
  });

  const valid = validate({
    path: path.join(__dirname, "..", "__fixtures__", "baz", "foo.txt"),
  });
  expect(valid).toBe(false);
  expect(validate.errors?.length).toBe(1);
  expect({
  ...validate.errors![0],
  // remove the params.file to make test universal
  params: _.omit(validate.errors![0]["params"], ["file"]) }).
toMatchInlineSnapshot(`
Object {
  "instancePath": "",
  "keyword": "contents",
  "message": "file contents do not match pattern(s)",
  "params": Object {
    "patterns": "/^FOO=1$/",
  },
  "schemaPath": "#/contents",
}
`);
});
