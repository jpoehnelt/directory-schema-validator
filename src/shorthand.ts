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

import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import path from "path";

export type JSONSchemaDefinition = JSONSchema7Definition & {
  contents?: string[];
};

export type Definition = [string, JSONSchemaDefinition];
export type ShorthandDefinition = (string | Definition)[];

const upgradeToRule = (stringOrRule: string | Definition): Definition => {
  if (typeof stringOrRule === "string") {
    return [stringOrRule, {}];
  }
  return stringOrRule;
};

export const shorthandToJSONSchema = (
  rules: ShorthandDefinition,
  basePath = ""
): JSONSchema7 => {
  const schema: JSONSchema7 = { type: "object" };
  rules.map(upgradeToRule).forEach(([file, def]) => {
    let ref = schema;

    if (!basePath.endsWith("/")) {
      basePath += "/";
    }

    let dirname = file;
    
    // remove file prefix if matches basePath
    if (file.startsWith(basePath)) {
      dirname = file.slice(basePath.length);
    }

    dirname.split("/").forEach((dir, i, dirs) => {
      if (dirs.length - 1 === i) {
        return;
      }

      ref.required = ref.required || [];

      if (!ref.required.includes("directories")) {
        ref.required.push("directories");
      }

      ref.properties = ref.properties || {};
      ref.properties.directories = (ref.properties.directories ||
        {}) as JSONSchema7;
      ref.properties.directories.properties =
        ref.properties.directories.properties || {};
      ref.properties.directories.properties[dir] = ref.properties.directories
        .properties[dir] || { type: "object" };
      ref.properties.directories.type = "object";
      ref.properties.directories.required =
        ref.properties.directories.required || [];

      if (!ref.properties.directories.required.includes(dir)) {
        ref.properties.directories.required.push(dir);
      }

      ref = ref.properties.directories.properties[dir] as JSONSchema7;
    });

    const filename = path.basename(file);

    ref.properties = ref.properties || {};
    ref.properties.files = (ref.properties.files || {}) as JSONSchema7;
    ref.properties.files.properties = ref.properties.files.properties || {};
    ref.properties.files.properties[filename] = ref.properties.files.properties[
      filename
    ] || { type: "object" };
    ref.properties.files.properties[filename] = {
      // @ts-ignore TODO handle case where JSONDefinition is boolean
      ...ref.properties.files.properties[filename],
      // @ts-ignore TODO handle case where JSONDefinition is boolean
      ...def,
    };
    ref.properties.files.type = "object";
    ref.properties.files.required = ref.properties.files.required || [];

    if (!ref.properties.files.required.includes(filename)) {
      ref.properties.files.required.push(filename);
    }
  });

  return schema;
};
