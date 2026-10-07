// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["accept", "HTMLInputElement", "accept", "accept"],
  ["alt", "HTMLInputElement", "alt", "alt"],
  ["autocomplete", "HTMLInputElement", "autocomplete", "autocomplete"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["dirName", "HTMLInputElement", "dirName", "dirname"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["formTarget", "HTMLInputElement", "formTarget", "formtarget"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["max", "HTMLInputElement", "max", "max"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART5_TABLE_ROWS = [
  ["min", "HTMLInputElement", "min", "min"],
];

export const stringReflectionPart5Table = STRING_REFLECTION_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART6_TABLE_ROWS = [
  ["name", "HTMLInputElement", "name", "name"],
  ["pattern", "HTMLInputElement", "pattern", "pattern"],
  ["placeholder", "HTMLInputElement", "placeholder", "placeholder"],
];

export const stringReflectionPart6Table = STRING_REFLECTION_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART7_TABLE_ROWS = [
  ["step", "HTMLInputElement", "step", "step"],
];

export const stringReflectionPart7Table = STRING_REFLECTION_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART8_TABLE_ROWS = [
  ["align", "HTMLInputElement", "align", "align"],
  ["useMap", "HTMLInputElement", "useMap", "usemap"],
];

export const stringReflectionPart8Table = STRING_REFLECTION_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
