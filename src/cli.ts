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

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { shorthandToJSONSchema, Validator } from ".";
import glob from "fast-glob";
import { parse } from "./parse";
import fs from "fs";

yargs(hideBin(process.argv))
  .command(
    "validate <schema> <directory>",
    "validate a directory using a JSON schema",
    {},
    (argv) => {
      const schema = JSON.parse(fs.readFileSync(argv.schema as string, "utf8"));
      const validator = new Validator();
      const valid = validator.validate(
        schema,
        argv.directory as string
      );

      if (!valid) {
        console.error(validator.errors);
        process.exit(1);
      }
    }
  )
  .command(
    "shorthand <globs...>",
    "generate JSON schema from globs",
    (yargs) => yargs.option("base-path", { type: "string" }),
    async (argv) => {
      const files = await glob(argv.globs as string[], { dot: false });
      console.log(
        JSON.stringify(shorthandToJSONSchema(files, argv["base-path"]), null, 2)
      );
    }
  )
  .command("parse <folder>", "parse JSON for folder", {}, async (argv) => {
    console.log(JSON.stringify(parse(argv.folder as string), null, 2));
  })
  .help().argv;
