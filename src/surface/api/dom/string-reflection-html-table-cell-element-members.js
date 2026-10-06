// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["abbr", "HTMLTableCellElement", "abbr", "abbr"],
  ["align", "HTMLTableCellElement", "align", "align"],
  ["axis", "HTMLTableCellElement", "axis", "axis"],
  ["bgColor", "HTMLTableCellElement", "bgColor", "bgcolor"],
  ["chOff", "HTMLTableCellElement", "chOff", "charoff"],
  ["ch", "HTMLTableCellElement", "ch", "char"],
  ["headers", "HTMLTableCellElement", "headers", "headers"],
  ["height", "HTMLTableCellElement", "height", "height"],
  ["scope", "HTMLTableCellElement", "scope", "scope"],
  ["vAlign", "HTMLTableCellElement", "vAlign", "valign"],
  ["width", "HTMLTableCellElement", "width", "width"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

