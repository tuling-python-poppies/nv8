// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["alt", "HTMLAreaElement", "alt", "alt"],
  ["attributionSrc", "HTMLAreaElement", "attributionSrc", "attributionsrc"],
  ["coords", "HTMLAreaElement", "coords", "coords"],
  ["download", "HTMLAreaElement", "download", "download"],
  ["ping", "HTMLAreaElement", "ping", "ping"],
  ["referrerPolicy", "HTMLAreaElement", "referrerPolicy", "referrerpolicy"],
  ["rel", "HTMLAreaElement", "rel", "rel"],
  ["shape", "HTMLAreaElement", "shape", "shape"],
  ["target", "HTMLAreaElement", "target", "target"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

