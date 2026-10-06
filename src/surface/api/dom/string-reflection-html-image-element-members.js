// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["align", "HTMLImageElement", "align", "align"],
  ["alt", "HTMLImageElement", "alt", "alt"],
  ["attributionSrc", "HTMLImageElement", "attributionSrc", "attributionsrc"],
  ["border", "HTMLImageElement", "border", "border"],
  ["decoding", "HTMLImageElement", "decoding", "decoding"],
  ["fetchPriority", "HTMLImageElement", "fetchPriority", "fetchpriority"],
  ["loading", "HTMLImageElement", "loading", "loading"],
  ["name", "HTMLImageElement", "name", "name"],
  ["referrerPolicy", "HTMLImageElement", "referrerPolicy", "referrerpolicy"],
  ["sizes", "HTMLImageElement", "sizes", "sizes"],
  ["srcset", "HTMLImageElement", "srcset", "srcset"],
  ["useMap", "HTMLImageElement", "useMap", "usemap"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

