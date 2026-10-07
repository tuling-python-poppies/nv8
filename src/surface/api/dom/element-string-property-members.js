// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementStringProperty } from "./element-extended-property.js";

const ELEMENT_STRING_PROPERTY_PART1_TABLE_ROWS = [
  ["slot", "slot"],
];

export const elementStringPropertyPart1Table = ELEMENT_STRING_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementStringProperty(...args)],
);

const ELEMENT_STRING_PROPERTY_PART2_TABLE_ROWS = [
  ["elementTiming", "elementTiming", "elementtiming"],
];

export const elementStringPropertyPart2Table = ELEMENT_STRING_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementStringProperty(...args)],
);
