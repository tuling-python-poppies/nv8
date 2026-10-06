// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_TABLE_ROWS = [
  ["as", "HTMLLinkElement", "as", "as"],
  ["charset", "HTMLLinkElement", "charset", "charset"],
  ["hreflang", "HTMLLinkElement", "hreflang", "hreflang"],
  ["imageSizes", "HTMLLinkElement", "imageSizes", "imagesizes"],
  ["imageSrcset", "HTMLLinkElement", "imageSrcset", "imagesrcset"],
  ["integrity", "HTMLLinkElement", "integrity", "integrity"],
  ["media", "HTMLLinkElement", "media", "media"],
  ["referrerPolicy", "HTMLLinkElement", "referrerPolicy", "referrerpolicy"],
  ["rel", "HTMLLinkElement", "rel", "rel"],
  ["rev", "HTMLLinkElement", "rev", "rev"],
  ["target", "HTMLLinkElement", "target", "target"],
  ["type", "HTMLLinkElement", "type", "type"],
];

export const stringReflectionTable = STRING_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

