// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["autocomplete", "HTMLTextAreaElement", "autocomplete", "autocomplete"],
  ["dirName", "HTMLTextAreaElement", "dirName", "dirname"],
  ["name", "HTMLTextAreaElement", "name", "name"],
  ["placeholder", "HTMLTextAreaElement", "placeholder", "placeholder"],
  ["wrap", "HTMLTextAreaElement", "wrap", "wrap"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

