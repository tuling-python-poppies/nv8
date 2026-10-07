// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_PART1_TABLE_ROWS = [
  ["disabled", "HTMLInputElement", "disabled", "disabled"],
];

export const booleanReflectionPart1Table = BOOLEAN_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART2_TABLE_ROWS = [
  ["formNoValidate", "HTMLInputElement", "formNoValidate", "formnovalidate"],
];

export const booleanReflectionPart2Table = BOOLEAN_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART3_TABLE_ROWS = [
  ["multiple", "HTMLInputElement", "multiple", "multiple"],
];

export const booleanReflectionPart3Table = BOOLEAN_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART4_TABLE_ROWS = [
  ["readOnly", "HTMLInputElement", "readOnly", "readonly"],
  ["required", "HTMLInputElement", "required", "required"],
];

export const booleanReflectionPart4Table = BOOLEAN_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART5_TABLE_ROWS = [
  ["webkitdirectory", "HTMLInputElement", "webkitdirectory", "webkitdirectory"],
  ["incremental", "HTMLInputElement", "incremental", "incremental"],
];

export const booleanReflectionPart5Table = BOOLEAN_REFLECTION_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);
