// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mutableMatrixComponent } from "./dom-matrix-component.js";

const MUTABLE_MATRIX_COMPONENT_TABLE_ROWS = [
  ["a", "a"],
  ["b", "b"],
  ["c", "c"],
  ["d", "d"],
  ["e", "e"],
  ["f", "f"],
  ["m11", "m11"],
  ["m12", "m12"],
  ["m13", "m13"],
  ["m14", "m14"],
  ["m21", "m21"],
  ["m22", "m22"],
  ["m23", "m23"],
  ["m24", "m24"],
  ["m31", "m31"],
  ["m32", "m32"],
  ["m33", "m33"],
  ["m34", "m34"],
  ["m41", "m41"],
  ["m42", "m42"],
  ["m43", "m43"],
  ["m44", "m44"],
];

export const mutableMatrixComponentTable = MUTABLE_MATRIX_COMPONENT_TABLE_ROWS.map(
  ([name, ...args]) => [name, mutableMatrixComponent(...args)],
);

