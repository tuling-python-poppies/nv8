// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["type", "HTMLScriptElement", "type", "type"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["charset", "HTMLScriptElement", "charset", "charset"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["referrerPolicy", "HTMLScriptElement", "referrerPolicy", "referrerpolicy"],
  ["fetchPriority", "HTMLScriptElement", "fetchPriority", "fetchpriority"],
  ["event", "HTMLScriptElement", "event", "event"],
  ["htmlFor", "HTMLScriptElement", "htmlFor", "for"],
  ["integrity", "HTMLScriptElement", "integrity", "integrity"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["attributionSrc", "HTMLScriptElement", "attributionSrc", "attributionsrc"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
