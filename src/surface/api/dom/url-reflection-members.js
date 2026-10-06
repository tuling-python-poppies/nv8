// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { urlReflection } from "./html-reflection.js";

const URL_REFLECTION_TABLE_ROWS = [
  ["href", "HTMLAnchorElement", "href", "href"],
  ["href", "HTMLAreaElement", "href", "href"],
  ["href", "HTMLBaseElement", "href", "href"],
  ["src", "HTMLEmbedElement", "src", "src"],
  ["longDesc", "HTMLImageElement", "longDesc", "longdesc"],
  ["lowsrc", "HTMLImageElement", "lowsrc", "lowsrc"],
  ["src", "HTMLImageElement", "src", "src"],
  ["src", "HTMLInputElement", "src", "src"],
  ["href", "HTMLLinkElement", "href", "href"],
  ["cite", "HTMLModElement", "cite", "cite"],
  ["cite", "HTMLQuoteElement", "cite", "cite"],
  ["src", "HTMLScriptElement", "src", "src"],
  ["src", "HTMLSourceElement", "src", "src"],
];

export const urlReflectionTable = URL_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, urlReflection(...args)],
);

