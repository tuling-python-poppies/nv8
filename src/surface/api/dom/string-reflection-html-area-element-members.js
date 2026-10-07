// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["alt", "HTMLAreaElement", "alt", "alt"],
  ["coords", "HTMLAreaElement", "coords", "coords"],
  ["download", "HTMLAreaElement", "download", "download"],
  ["shape", "HTMLAreaElement", "shape", "shape"],
  ["target", "HTMLAreaElement", "target", "target"],
  ["ping", "HTMLAreaElement", "ping", "ping"],
  ["rel", "HTMLAreaElement", "rel", "rel"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["referrerPolicy", "HTMLAreaElement", "referrerPolicy", "referrerpolicy"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["attributionSrc", "HTMLAreaElement", "attributionSrc", "attributionsrc"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
