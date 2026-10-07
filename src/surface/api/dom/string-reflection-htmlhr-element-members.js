// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["align", "HTMLHRElement", "align", "align"],
  ["color", "HTMLHRElement", "color", "color"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["size", "HTMLHRElement", "size", "size"],
  ["width", "HTMLHRElement", "width", "width"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
