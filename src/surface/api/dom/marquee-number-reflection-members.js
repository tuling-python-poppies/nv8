// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";

const MARQUEE_NUMBER_REFLECTION_TABLE_ROWS = [
  ["hspace", "hspace", "hspace", 0],
  ["loop", "loop", "loop", -1, true],
  ["scrollAmount", "scrollAmount", "scrollamount", 6],
  ["scrollDelay", "scrollDelay", "scrolldelay", 85],
  ["vspace", "vspace", "vspace", 0],
];

export const marqueeNumberReflectionTable = MARQUEE_NUMBER_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, marqueeNumberReflection(...args)],
);

