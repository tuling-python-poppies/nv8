// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { unsignedReflection } from "./html-reflection.js";

const UNSIGNED_REFLECTION_PART1_TABLE_ROWS = [
  ["hspace", "HTMLObjectElement", "hspace", "hspace"],
];

export const unsignedReflectionPart1Table = UNSIGNED_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, unsignedReflection(...args)],
);

const UNSIGNED_REFLECTION_PART2_TABLE_ROWS = [
  ["vspace", "HTMLObjectElement", "vspace", "vspace"],
];

export const unsignedReflectionPart2Table = UNSIGNED_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, unsignedReflection(...args)],
);
