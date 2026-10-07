// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["align", "HTMLTableRowElement", "align", "align"],
  ["ch", "HTMLTableRowElement", "ch", "char"],
  ["chOff", "HTMLTableRowElement", "chOff", "charoff"],
  ["vAlign", "HTMLTableRowElement", "vAlign", "valign"],
  ["bgColor", "HTMLTableRowElement", "bgColor", "bgcolor"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
