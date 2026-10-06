// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { unsignedReflection } from "./html-reflection.js";

const UNSIGNED_REFLECTION_TABLE_ROWS = [
  ["hspace", "HTMLObjectElement", "hspace", "hspace"],
  ["vspace", "HTMLObjectElement", "vspace", "vspace"],
];

export const unsignedReflectionTable = UNSIGNED_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, unsignedReflection(...args)],
);

