// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { longReflection } from "./html-reflection.js";

const LONG_REFLECTION_TABLE_ROWS = [
  ["value", "HTMLLIElement", "value", "value"],
  ["start", "HTMLOListElement", "start", "start", 1],
];

export const longReflectionTable = LONG_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, longReflection(...args)],
);

