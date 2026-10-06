// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementStringProperty } from "./element-extended-property.js";

const ELEMENT_STRING_PROPERTY_TABLE_ROWS = [
  ["elementTiming", "elementTiming", "elementtiming"],
  ["slot", "slot"],
];

export const elementStringPropertyTable = ELEMENT_STRING_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementStringProperty(...args)],
);

