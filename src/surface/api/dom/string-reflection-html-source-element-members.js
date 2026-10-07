// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["type", "HTMLSourceElement", "type", "type"],
  ["srcset", "HTMLSourceElement", "srcset", "srcset"],
  ["sizes", "HTMLSourceElement", "sizes", "sizes"],
  ["media", "HTMLSourceElement", "media", "media"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
