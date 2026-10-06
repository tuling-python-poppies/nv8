// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { unsignedReflection } from "./html-reflection.js";

const UNSIGNED_REFLECTION_TABLE_ROWS = [
  ["height", "HTMLSourceElement", "height", "height"],
  ["width", "HTMLSourceElement", "width", "width"],
];

export const unsignedReflectionTable = UNSIGNED_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, unsignedReflection(...args)],
);

