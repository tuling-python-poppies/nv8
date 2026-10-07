// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_PART1_TABLE_ROWS = [
  ["reversed", "HTMLOListElement", "reversed", "reversed"],
];

export const booleanReflectionPart1Table = BOOLEAN_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART2_TABLE_ROWS = [
  ["compact", "HTMLOListElement", "compact", "compact"],
];

export const booleanReflectionPart2Table = BOOLEAN_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);
