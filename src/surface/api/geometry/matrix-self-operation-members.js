// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import {
  matrixSelfOperation,
  optionalNumber,
} from "./dom-matrix-self-operation.js";
import {
  invertMatrix,
  matrixFromValue,
  multiplyMatrices,
  axisRotationMatrix,
  rotationZMatrix,
  translationMatrix,
} from "./dom-matrix-state.js";

const MATRIX_SELF_OPERATION_PART1_TABLE_ROWS = [
  ["invertSelf", "invertSelf", invertMatrix],
  ["multiplySelf", "multiplySelf", (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0]))],
  ["preMultiplySelf", "preMultiplySelf", (matrix, args) => multiplyMatrices(matrixFromValue(args[0]), matrix)],
  ["rotateAxisAngleSelf", "rotateAxisAngleSelf", (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  ))],
  ["rotateFromVectorSelf", "rotateFromVectorSelf", (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(Math.atan2(
      optionalNumber(args, 1, 0),
      optionalNumber(args, 0, 0),
    ) * 180 / Math.PI),
  )],
  ["rotateSelf", "rotateSelf", (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(optionalNumber(args, 0, 0)),
  )],
];

export const matrixSelfOperationPart1Table = MATRIX_SELF_OPERATION_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, matrixSelfOperation(...args)],
);

const MATRIX_SELF_OPERATION_PART2_TABLE_ROWS = [
  ["translateSelf", "translateSelf", (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  ))],
];

export const matrixSelfOperationPart2Table = MATRIX_SELF_OPERATION_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, matrixSelfOperation(...args)],
);
