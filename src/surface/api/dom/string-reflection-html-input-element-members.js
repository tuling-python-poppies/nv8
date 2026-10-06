// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["accept", "HTMLInputElement", "accept", "accept"],
  ["align", "HTMLInputElement", "align", "align"],
  ["alt", "HTMLInputElement", "alt", "alt"],
  ["autocomplete", "HTMLInputElement", "autocomplete", "autocomplete"],
  ["dirName", "HTMLInputElement", "dirName", "dirname"],
  ["formTarget", "HTMLInputElement", "formTarget", "formtarget"],
  ["max", "HTMLInputElement", "max", "max"],
  ["min", "HTMLInputElement", "min", "min"],
  ["name", "HTMLInputElement", "name", "name"],
  ["pattern", "HTMLInputElement", "pattern", "pattern"],
  ["placeholder", "HTMLInputElement", "placeholder", "placeholder"],
  ["step", "HTMLInputElement", "step", "step"],
  ["useMap", "HTMLInputElement", "useMap", "usemap"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

