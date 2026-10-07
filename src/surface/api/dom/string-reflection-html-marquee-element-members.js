// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { stringReflection } from "./html-reflection.js";

const STRING_REFLECTION_PART1_TABLE_ROWS = [
  ["behavior", "HTMLMarqueeElement", "behavior", "behavior"],
  ["bgColor", "HTMLMarqueeElement", "bgColor", "bgcolor"],
  ["direction", "HTMLMarqueeElement", "direction", "direction"],
  ["height", "HTMLMarqueeElement", "height", "height"],
];

export const stringReflectionPart1Table = STRING_REFLECTION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);

const STRING_REFLECTION_PART2_TABLE_ROWS = [
  ["width", "HTMLMarqueeElement", "width", "width"],
];

export const stringReflectionPart2Table = STRING_REFLECTION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, stringReflection(...args)],
);
