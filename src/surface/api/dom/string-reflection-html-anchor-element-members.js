// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["target", "HTMLAnchorElement", "target", "target"],
  ["download", "HTMLAnchorElement", "download", "download"],
  ["ping", "HTMLAnchorElement", "ping", "ping"],
  ["rel", "HTMLAnchorElement", "rel", "rel"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["hreflang", "HTMLAnchorElement", "hreflang", "hreflang"],
  ["type", "HTMLAnchorElement", "type", "type"],
  ["referrerPolicy", "HTMLAnchorElement", "referrerPolicy", "referrerpolicy"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["coords", "HTMLAnchorElement", "coords", "coords"],
  ["charset", "HTMLAnchorElement", "charset", "charset"],
  ["name", "HTMLAnchorElement", "name", "name"],
  ["rev", "HTMLAnchorElement", "rev", "rev"],
  ["shape", "HTMLAnchorElement", "shape", "shape"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["hrefTranslate", "HTMLAnchorElement", "hrefTranslate", "hreftranslate"],
  ["attributionSrc", "HTMLAnchorElement", "attributionSrc", "attributionsrc"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
