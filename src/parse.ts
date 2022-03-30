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
import dirTree from "directory-tree";
import fs from "fs";
import path from "path";

export type Children = { [key: string]: DirectoryTreeMap };

export interface DirectoryTreeMap
  extends Required<
    Omit<dirTree.DirectoryTree, "children" | "extension" | "isSymbolicLink">
  > {
  directories?: Children;
  files?: Children;
}

export const treeToTreeMap = (
  tree: dirTree.DirectoryTree
): DirectoryTreeMap => {
  const treeMap: DirectoryTreeMap = _.omit(tree, ["children"]);
  if (tree.children) {
    treeMap.directories = {};
    treeMap.files = {};

    for (const child of tree.children) {
      switch (child.type) {
        case "directory":
          treeMap.directories[child.name] = treeToTreeMap(child);
          break;
        case "file":
          treeMap.files[child.name] = treeToTreeMap(child);
          break;
      }
    }
  }

  return treeMap;
};

export const parse = (
  directory: string,
  exclude = /(node_modules\/|\.git\/|\.DS_Store|\.idea\/|\.vscode\/)/
): DirectoryTreeMap => {
  const attributes = ["size" as const, "type" as const, "extension" as const];

  directory = path.resolve(directory);

  if (!fs.existsSync(directory)) {
    throw new Error(`Directory ${directory} does not exist`);
  }
  const tree = dirTree(directory, {
    attributes,
    exclude,
    normalizePath: true,
  });

  return treeToTreeMap(tree);
};
