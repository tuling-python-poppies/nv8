// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["name", "HTMLMetaElement", "name", "name"],
  ["httpEquiv", "HTMLMetaElement", "httpEquiv", "http-equiv"],
  ["content", "HTMLMetaElement", "content", "content"],
  ["media", "HTMLMetaElement", "media", "media"],
  ["scheme", "HTMLMetaElement", "scheme", "scheme"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
