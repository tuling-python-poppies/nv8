// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { textAreaNumberReflection } from "./html-text-area-element-number-reflection.js";

const TEXT_AREA_NUMBER_REFLECTION_PART1_TABLE_ROWS = [
  ["cols", "cols", "cols", 20, true],
];

export const textAreaNumberReflectionPart1Table = TEXT_AREA_NUMBER_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, textAreaNumberReflection(...args)],
);

const TEXT_AREA_NUMBER_REFLECTION_PART2_TABLE_ROWS = [
  ["maxLength", "maxLength", "maxlength", -1, false],
  ["minLength", "minLength", "minlength", -1, false],
];

export const textAreaNumberReflectionPart2Table = TEXT_AREA_NUMBER_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, textAreaNumberReflection(...args)],
);

const TEXT_AREA_NUMBER_REFLECTION_PART3_TABLE_ROWS = [
  ["rows", "rows", "rows", 2, true],
];

export const textAreaNumberReflectionPart3Table = TEXT_AREA_NUMBER_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, textAreaNumberReflection(...args)],
);
