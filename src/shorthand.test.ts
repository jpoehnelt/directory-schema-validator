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

import { shorthandToJSONSchema } from "./shorthand";

test("should have all directories", () => {
  expect(
    shorthandToJSONSchema([
      "foo/bar/bar.yaml",
      "foo/bar/foo.yaml",
      [
        "foo/baz/baz.yaml",
        {
          contents: ["baz"],
          properties: {
            size: {
              type: "number",
              minimum: 0,
              maximum: 100,
            },
          },
        },
      ],
    ])
  ).toMatchInlineSnapshot(`
Object {
  "properties": Object {
    "directories": Object {
      "properties": Object {
        "foo": Object {
          "properties": Object {
            "directories": Object {
              "properties": Object {
                "bar": Object {
                  "properties": Object {
                    "files": Object {
                      "properties": Object {
                        "bar.yaml": Object {
                          "type": "object",
                        },
                        "foo.yaml": Object {
                          "type": "object",
                        },
                      },
                      "required": Array [
                        "bar.yaml",
                        "foo.yaml",
                      ],
                      "type": "object",
                    },
                  },
                  "type": "object",
                },
                "baz": Object {
                  "properties": Object {
                    "files": Object {
                      "properties": Object {
                        "baz.yaml": Object {
                          "contents": Array [
                            "baz",
                          ],
                          "properties": Object {
                            "size": Object {
                              "maximum": 100,
                              "minimum": 0,
                              "type": "number",
                            },
                          },
                          "type": "object",
                        },
                      },
                      "required": Array [
                        "baz.yaml",
                      ],
                      "type": "object",
                    },
                  },
                  "type": "object",
                },
              },
              "required": Array [
                "bar",
                "baz",
              ],
              "type": "object",
            },
          },
          "required": Array [
            "directories",
          ],
          "type": "object",
        },
      },
      "required": Array [
        "foo",
      ],
      "type": "object",
    },
  },
  "required": Array [
    "directories",
  ],
  "type": "object",
}
`);
});
