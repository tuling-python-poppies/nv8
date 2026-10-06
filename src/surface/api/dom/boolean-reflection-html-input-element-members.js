// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_TABLE_ROWS = [
  ["disabled", "HTMLInputElement", "disabled", "disabled"],
  ["formNoValidate", "HTMLInputElement", "formNoValidate", "formnovalidate"],
  ["incremental", "HTMLInputElement", "incremental", "incremental"],
  ["multiple", "HTMLInputElement", "multiple", "multiple"],
  ["readOnly", "HTMLInputElement", "readOnly", "readonly"],
  ["required", "HTMLInputElement", "required", "required"],
  ["webkitdirectory", "HTMLInputElement", "webkitdirectory", "webkitdirectory"],
];

export const booleanReflectionTable = BOOLEAN_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

