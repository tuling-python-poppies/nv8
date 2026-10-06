// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["attributionSrc", "HTMLAnchorElement", "attributionSrc", "attributionsrc"],
  ["charset", "HTMLAnchorElement", "charset", "charset"],
  ["coords", "HTMLAnchorElement", "coords", "coords"],
  ["download", "HTMLAnchorElement", "download", "download"],
  ["hrefTranslate", "HTMLAnchorElement", "hrefTranslate", "hreftranslate"],
  ["hreflang", "HTMLAnchorElement", "hreflang", "hreflang"],
  ["name", "HTMLAnchorElement", "name", "name"],
  ["ping", "HTMLAnchorElement", "ping", "ping"],
  ["referrerPolicy", "HTMLAnchorElement", "referrerPolicy", "referrerpolicy"],
  ["rel", "HTMLAnchorElement", "rel", "rel"],
  ["rev", "HTMLAnchorElement", "rev", "rev"],
  ["shape", "HTMLAnchorElement", "shape", "shape"],
  ["target", "HTMLAnchorElement", "target", "target"],
  ["type", "HTMLAnchorElement", "type", "type"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

