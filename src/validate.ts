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

import Ajv from "ajv";
import type { Schema, ErrorObject } from "ajv";
import { contents } from "./keywords/contents";
import { parse } from "./parse";

export class Validator {
  public ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({});
    this.ajv.addKeyword(contents);
  }

  validate(schema: string | Schema, data: string): boolean {
    const tree = parse(data);
    return this.ajv.validate(schema, tree);
  }

  get errors():
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined {
    return this.ajv.errors;
  }
}
