// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_PART1_TABLE_ROWS = [
  ["noModule", "HTMLScriptElement", "noModule", "nomodule"],
];

export const booleanReflectionPart1Table = BOOLEAN_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

const BOOLEAN_REFLECTION_PART2_TABLE_ROWS = [
  ["defer", "HTMLScriptElement", "defer", "defer"],
];

export const booleanReflectionPart2Table = BOOLEAN_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);
