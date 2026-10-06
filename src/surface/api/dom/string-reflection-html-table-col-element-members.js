// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["align", "HTMLTableColElement", "align", "align"],
  ["chOff", "HTMLTableColElement", "chOff", "charoff"],
  ["ch", "HTMLTableColElement", "ch", "char"],
  ["vAlign", "HTMLTableColElement", "vAlign", "valign"],
  ["width", "HTMLTableColElement", "width", "width"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

