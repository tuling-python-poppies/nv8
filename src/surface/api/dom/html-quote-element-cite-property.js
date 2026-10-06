// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { urlReflection } from "./html-reflection.js";

const URL_REFLECTION_TABLE_ROWS = [
  ["cite", "HTMLQuoteElement", "cite", "cite"],
];

export const urlReflectionTable = URL_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, urlReflection(...args)],
);

