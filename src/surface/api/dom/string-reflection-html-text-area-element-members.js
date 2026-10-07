// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["autocomplete", "HTMLTextAreaElement", "autocomplete", "autocomplete"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["dirName", "HTMLTextAreaElement", "dirName", "dirname"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["name", "HTMLTextAreaElement", "name", "name"],
  ["placeholder", "HTMLTextAreaElement", "placeholder", "placeholder"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["wrap", "HTMLTextAreaElement", "wrap", "wrap"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
