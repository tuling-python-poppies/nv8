// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["headers", "HTMLTableCellElement", "headers", "headers"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["align", "HTMLTableCellElement", "align", "align"],
  ["axis", "HTMLTableCellElement", "axis", "axis"],
  ["height", "HTMLTableCellElement", "height", "height"],
  ["width", "HTMLTableCellElement", "width", "width"],
  ["ch", "HTMLTableCellElement", "ch", "char"],
  ["chOff", "HTMLTableCellElement", "chOff", "charoff"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["vAlign", "HTMLTableCellElement", "vAlign", "valign"],
  ["bgColor", "HTMLTableCellElement", "bgColor", "bgcolor"],
  ["abbr", "HTMLTableCellElement", "abbr", "abbr"],
  ["scope", "HTMLTableCellElement", "scope", "scope"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
