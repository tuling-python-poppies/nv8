// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementNumberProperty } from "./element-extended-property.js";

const ELEMENT_NUMBER_PROPERTY_TABLE_ROWS = [
  ["scrollLeft", "scrollLeft"],
  ["scrollTop", "scrollTop"],
];

export const elementNumberPropertyTable = ELEMENT_NUMBER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNumberProperty(...args)],
);

