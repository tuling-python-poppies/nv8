// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["type", "HTMLEmbedElement", "type", "type"],
  ["width", "HTMLEmbedElement", "width", "width"],
  ["height", "HTMLEmbedElement", "height", "height"],
  ["align", "HTMLEmbedElement", "align", "align"],
  ["name", "HTMLEmbedElement", "name", "name"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
