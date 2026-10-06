// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import {
  readonlyMatrixOperation,
  optionalNumber,
} from "./dom-matrix-read-only-operation.js";
import {
  multiplyMatrices,
  scalingMatrix,
  invertMatrix,
  matrixFromValue,
  axisRotationMatrix,
  rotationZMatrix,
  translationMatrix,
} from "./dom-matrix-state.js";

const READONLY_MATRIX_OPERATION_TABLE_ROWS = [
  ["flipX", "flipX", matrix => multiplyMatrices(matrix, scalingMatrix(-1, 1, 1))],
  ["flipY", "flipY", matrix => multiplyMatrices(matrix, scalingMatrix(1, -1, 1))],
  ["inverse", "inverse", invertMatrix],
  ["multiply", "multiply", (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0]))],
  ["rotateAxisAngle", "rotateAxisAngle", (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  ))],
  ["rotateFromVector", "rotateFromVector", (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(Math.atan2(
      optionalNumber(args, 1, 0),
      optionalNumber(args, 0, 0),
    ) * 180 / Math.PI),
  )],
  ["scaleNonUniform", "scaleNonUniform", (matrix, args) => multiplyMatrices(
    matrix,
    scalingMatrix(
      optionalNumber(args, 0, 1),
      optionalNumber(args, 1, 1),
      1,
    ),
  )],
  ["translate", "translate", (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  ))],
];

export const readonlyMatrixOperationTable = READONLY_MATRIX_OPERATION_TABLE_ROWS.map(
  ([name, ...args]) => [name, readonlyMatrixOperation(...args)],
);

