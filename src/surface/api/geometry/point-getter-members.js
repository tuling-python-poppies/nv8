// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { pointGetter } from "./dom-point-property.js";

const POINT_GETTER_TABLE_ROWS = [
  ["w", "w"],
  ["x", "x"],
  ["y", "y"],
  ["z", "z"],
];

export const pointGetterTable = POINT_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, pointGetter(...args)],
);

