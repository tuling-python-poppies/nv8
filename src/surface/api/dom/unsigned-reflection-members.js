// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { unsignedReflection } from "./html-reflection.js";

const UNSIGNED_REFLECTION_TABLE_ROWS = [
  ["height", "HTMLImageElement", "height", "height"],
  ["hspace", "HTMLImageElement", "hspace", "hspace"],
  ["vspace", "HTMLImageElement", "vspace", "vspace"],
  ["width", "HTMLImageElement", "width", "width"],
  ["hspace", "HTMLObjectElement", "hspace", "hspace"],
  ["vspace", "HTMLObjectElement", "vspace", "vspace"],
  ["size", "HTMLSelectElement", "size", "size"],
  ["height", "HTMLSourceElement", "height", "height"],
  ["width", "HTMLSourceElement", "width", "width"],
];

export const unsignedReflectionTable = UNSIGNED_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, unsignedReflection(...args)],
);

