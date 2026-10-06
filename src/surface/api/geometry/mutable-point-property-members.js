// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mutablePointProperty } from "./dom-point-property.js";

const MUTABLE_POINT_PROPERTY_TABLE_ROWS = [
  ["w", "w"],
  ["x", "x"],
  ["y", "y"],
  ["z", "z"],
];

export const mutablePointPropertyTable = MUTABLE_POINT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mutablePointProperty(...args)],
);

