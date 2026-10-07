// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { dimensionProperty } from "./offscreen-canvas-property.js";

const DIMENSION_PROPERTY_TABLE_ROWS = [
  ["height"],
  ["width"],
];

export const dimensionPropertyTable = DIMENSION_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, dimensionProperty(name, ...args)],
);
