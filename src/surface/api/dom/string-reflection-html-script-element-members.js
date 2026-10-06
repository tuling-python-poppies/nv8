// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["attributionSrc", "HTMLScriptElement", "attributionSrc", "attributionsrc"],
  ["charset", "HTMLScriptElement", "charset", "charset"],
  ["event", "HTMLScriptElement", "event", "event"],
  ["fetchPriority", "HTMLScriptElement", "fetchPriority", "fetchpriority"],
  ["htmlFor", "HTMLScriptElement", "htmlFor", "for"],
  ["integrity", "HTMLScriptElement", "integrity", "integrity"],
  ["referrerPolicy", "HTMLScriptElement", "referrerPolicy", "referrerpolicy"],
  ["type", "HTMLScriptElement", "type", "type"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

