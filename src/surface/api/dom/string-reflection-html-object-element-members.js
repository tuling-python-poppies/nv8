// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["align", "HTMLObjectElement", "align", "align"],
  ["archive", "HTMLObjectElement", "archive", "archive"],
  ["border", "HTMLObjectElement", "border", "border"],
  ["codeBase", "HTMLObjectElement", "codeBase", "codebase"],
  ["code", "HTMLObjectElement", "code", "code"],
  ["codeType", "HTMLObjectElement", "codeType", "codetype"],
  ["data", "HTMLObjectElement", "data", "data"],
  ["height", "HTMLObjectElement", "height", "height"],
  ["name", "HTMLObjectElement", "name", "name"],
  ["standby", "HTMLObjectElement", "standby", "standby"],
  ["type", "HTMLObjectElement", "type", "type"],
  ["useMap", "HTMLObjectElement", "useMap", "usemap"],
  ["width", "HTMLObjectElement", "width", "width"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

