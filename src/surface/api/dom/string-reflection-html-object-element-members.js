// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["data", "HTMLObjectElement", "data", "data"],
  ["type", "HTMLObjectElement", "type", "type"],
  ["name", "HTMLObjectElement", "name", "name"],
  ["useMap", "HTMLObjectElement", "useMap", "usemap"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["width", "HTMLObjectElement", "width", "width"],
  ["height", "HTMLObjectElement", "height", "height"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["align", "HTMLObjectElement", "align", "align"],
  ["archive", "HTMLObjectElement", "archive", "archive"],
  ["code", "HTMLObjectElement", "code", "code"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["standby", "HTMLObjectElement", "standby", "standby"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART5_TABLE_ROWS = [
  ["codeBase", "HTMLObjectElement", "codeBase", "codebase"],
  ["codeType", "HTMLObjectElement", "codeType", "codetype"],
  ["border", "HTMLObjectElement", "border", "border"],
];

export const stringReflectionPart5Table = STRING_REFLECTION_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
