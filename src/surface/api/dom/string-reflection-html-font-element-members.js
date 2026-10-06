// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["color", "HTMLFontElement", "color", "color"],
  ["face", "HTMLFontElement", "face", "face"],
  ["size", "HTMLFontElement", "size", "size"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

