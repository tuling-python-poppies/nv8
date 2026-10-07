// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["align", "HTMLTableElement", "align", "align"],
  ["border", "HTMLTableElement", "border", "border"],
  ["frame", "HTMLTableElement", "frame", "frame"],
  ["rules", "HTMLTableElement", "rules", "rules"],
  ["summary", "HTMLTableElement", "summary", "summary"],
  ["width", "HTMLTableElement", "width", "width"],
  ["bgColor", "HTMLTableElement", "bgColor", "bgcolor"],
  ["cellPadding", "HTMLTableElement", "cellPadding", "cellpadding"],
  ["cellSpacing", "HTMLTableElement", "cellSpacing", "cellspacing"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
