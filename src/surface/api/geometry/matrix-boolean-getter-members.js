// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { matrixBooleanGetter } from "./dom-matrix-read-only-boolean-getter.js";

const MATRIX_BOOLEAN_GETTER_TABLE_ROWS = [
  ["is2D", "is2D"],
  ["isIdentity", "isIdentity"],
];

export const matrixBooleanGetterTable = MATRIX_BOOLEAN_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, matrixBooleanGetter(...args)],
);
