// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { inputNumberReflection } from "./html-input-element-number-reflection.js";

const INPUT_NUMBER_REFLECTION_TABLE_ROWS = [
  ["height", "height", "height", 0, 0, false],
  ["maxLength", "maxLength", "maxlength", -1, 0],
  ["minLength", "minLength", "minlength", -1, 0],
  ["size", "size", "size", 20, 1, false],
  ["width", "width", "width", 0, 0, false],
];

export const inputNumberReflectionTable = INPUT_NUMBER_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);

