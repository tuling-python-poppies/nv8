// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { readonlyMatrixValueOperation } from "./dom-matrix-read-only-operation.js";
import {
  is2DMatrix,
  isIdentityMatrix,
} from "./dom-matrix-state.js";

const READONLY_MATRIX_VALUE_OPERATION_TABLE_ROWS = [
  ["toFloat32Array", "toFloat32Array", matrix => new Float32Array(matrix)],
  ["toFloat64Array", "toFloat64Array", matrix => new Float64Array(matrix)],
  ["toJSON", "toJSON", matrix => ({
  a: matrix[0],
  b: matrix[1],
  c: matrix[4],
  d: matrix[5],
  e: matrix[12],
  f: matrix[13],
  m11: matrix[0],
  m12: matrix[1],
  m13: matrix[2],
  m14: matrix[3],
  m21: matrix[4],
  m22: matrix[5],
  m23: matrix[6],
  m24: matrix[7],
  m31: matrix[8],
  m32: matrix[9],
  m33: matrix[10],
  m34: matrix[11],
  m41: matrix[12],
  m42: matrix[13],
  m43: matrix[14],
  m44: matrix[15],
  is2D: is2DMatrix(matrix),
  isIdentity: isIdentityMatrix(matrix),
})],
  ["toString", "toString", matrix => is2DMatrix(matrix)
    ? `matrix(${[
        matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13],
      ].join(", ")})`
    : `matrix3d(${matrix.join(", ")})`],
];

export const readonlyMatrixValueOperationTable = READONLY_MATRIX_VALUE_OPERATION_TABLE_ROWS.map(
  ([name, ...args]) => [name, readonlyMatrixValueOperation(...args)],
);

