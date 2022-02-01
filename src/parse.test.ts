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

import { parse, DirectoryTreeMap } from "./parse";
import path from "path";

const removePathForTests = (tree: DirectoryTreeMap): any => {
  if (tree.directories) {
    for (let dir in tree.directories) {
      removePathForTests(tree.directories[dir]);
    }
  }

  if (tree.files) {
    for (let key in tree.files) {
      tree.files[key].path = "[removed]";
    }
  }

  tree.path = "[removed]";

  return tree;
};

test("it should parse the folder", () => {
  const tree = parse(path.join(__dirname, "__fixtures__", "baz"));

  expect(removePathForTests(tree)).toMatchInlineSnapshot(`
Object {
  "directories": Object {
    "bar": Object {
      "directories": Object {},
      "files": Object {
        "bar.txt": Object {
          "extension": ".txt",
          "name": "bar.txt",
          "path": "[removed]",
          "size": 5,
          "type": "file",
        },
      },
      "name": "bar",
      "path": "[removed]",
      "size": 5,
      "type": "directory",
    },
  },
  "files": Object {
    "foo.txt": Object {
      "extension": ".txt",
      "name": "foo.txt",
      "path": "[removed]",
      "size": 5,
      "type": "file",
    },
  },
  "name": "baz",
  "path": "[removed]",
  "size": 10,
  "type": "directory",
}
`);
});
