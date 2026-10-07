// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_TABLE_ROWS = [
  ["noHref", "HTMLAreaElement", "noHref", "nohref"],
];

export const booleanReflectionTable = BOOLEAN_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);
