// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["rel", "HTMLLinkElement", "rel", "rel"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["media", "HTMLLinkElement", "media", "media"],
  ["hreflang", "HTMLLinkElement", "hreflang", "hreflang"],
  ["type", "HTMLLinkElement", "type", "type"],
  ["as", "HTMLLinkElement", "as", "as"],
  ["referrerPolicy", "HTMLLinkElement", "referrerPolicy", "referrerpolicy"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART3_TABLE_ROWS = [
  ["imageSrcset", "HTMLLinkElement", "imageSrcset", "imagesrcset"],
  ["imageSizes", "HTMLLinkElement", "imageSizes", "imagesizes"],
  ["charset", "HTMLLinkElement", "charset", "charset"],
  ["rev", "HTMLLinkElement", "rev", "rev"],
  ["target", "HTMLLinkElement", "target", "target"],
];

export const stringReflectionPart3Table = STRING_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART4_TABLE_ROWS = [
  ["integrity", "HTMLLinkElement", "integrity", "integrity"],
];

export const stringReflectionPart4Table = STRING_REFLECTION_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
