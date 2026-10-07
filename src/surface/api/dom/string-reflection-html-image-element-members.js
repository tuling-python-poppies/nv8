// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["alt", "HTMLImageElement", "alt", "alt"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["srcset", "HTMLImageElement", "srcset", "srcset"],
  ["sizes", "HTMLImageElement", "sizes", "sizes"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["useMap", "HTMLImageElement", "useMap", "usemap"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["referrerPolicy", "HTMLImageElement", "referrerPolicy", "referrerpolicy"],
  ["decoding", "HTMLImageElement", "decoding", "decoding"],
  ["fetchPriority", "HTMLImageElement", "fetchPriority", "fetchpriority"],
  ["loading", "HTMLImageElement", "loading", "loading"],
  ["name", "HTMLImageElement", "name", "name"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART5_TABLE_ROWS = [
  ["align", "HTMLImageElement", "align", "align"],
];

export const stringReflectionPart5Table = STRING_REFLECTION_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART6_TABLE_ROWS = [
  ["border", "HTMLImageElement", "border", "border"],
];

export const stringReflectionPart6Table = STRING_REFLECTION_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART7_TABLE_ROWS = [
  ["attributionSrc", "HTMLImageElement", "attributionSrc", "attributionsrc"],
];

export const stringReflectionPart7Table = STRING_REFLECTION_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
