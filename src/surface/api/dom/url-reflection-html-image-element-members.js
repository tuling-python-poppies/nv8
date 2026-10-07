// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { urlReflection } from "./html-reflection.js";

const URL_REFLECTION_PART1_TABLE_ROWS = [
  ["src", "HTMLImageElement", "src", "src"],
];

export const urlReflectionPart1Table = URL_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, urlReflection(...args)],
);

const URL_REFLECTION_PART2_TABLE_ROWS = [
  ["lowsrc", "HTMLImageElement", "lowsrc", "lowsrc"],
];

export const urlReflectionPart2Table = URL_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, urlReflection(...args)],
);

const URL_REFLECTION_PART3_TABLE_ROWS = [
  ["longDesc", "HTMLImageElement", "longDesc", "longdesc"],
];

export const urlReflectionPart3Table = URL_REFLECTION_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, urlReflection(...args)],
);

export const src = new Map([...urlReflectionPart1Table, ...urlReflectionPart2Table, ...urlReflectionPart3Table]).get("src").get;
