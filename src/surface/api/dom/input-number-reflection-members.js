// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { inputNumberReflection } from "./html-input-element-number-reflection.js";

const INPUT_NUMBER_REFLECTION_PART1_TABLE_ROWS = [
  ["height", "height", "height", 0, 0, false],
];

export const inputNumberReflectionPart1Table = INPUT_NUMBER_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);

const INPUT_NUMBER_REFLECTION_PART2_TABLE_ROWS = [
  ["maxLength", "maxLength", "maxlength", -1, 0],
];

export const inputNumberReflectionPart2Table = INPUT_NUMBER_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);

const INPUT_NUMBER_REFLECTION_PART3_TABLE_ROWS = [
  ["minLength", "minLength", "minlength", -1, 0],
];

export const inputNumberReflectionPart3Table = INPUT_NUMBER_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);

const INPUT_NUMBER_REFLECTION_PART4_TABLE_ROWS = [
  ["size", "size", "size", 20, 1, false],
];

export const inputNumberReflectionPart4Table = INPUT_NUMBER_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);

const INPUT_NUMBER_REFLECTION_PART5_TABLE_ROWS = [
  ["width", "width", "width", 0, 0, false],
];

export const inputNumberReflectionPart5Table = INPUT_NUMBER_REFLECTION_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, inputNumberReflection(...args)],
);
