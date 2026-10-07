// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { nullableStringReflection } from "./html-reflection.js";

const NULLABLE_STRING_REFLECTION_TABLE_ROWS = [
  ["crossOrigin", "HTMLScriptElement", "crossOrigin", "crossorigin"],
];

export const nullableStringReflectionTable = NULLABLE_STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, nullableStringReflection(...args)],
);
