// geometry 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

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

export const flipX = readonlyMatrixOperation(
  "flipX",
  matrix => multiplyMatrices(matrix, scalingMatrix(-1, 1, 1)),
);
export const flipY = readonlyMatrixOperation(
  "flipY",
  matrix => multiplyMatrices(matrix, scalingMatrix(1, -1, 1)),
);
export const inverse = readonlyMatrixOperation("inverse", invertMatrix);
export const multiply = readonlyMatrixOperation(
  "multiply",
  (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0])),
);
export const rotateAxisAngle = readonlyMatrixOperation(
  "rotateAxisAngle",
  (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  )),
);
export const rotateFromVector = readonlyMatrixOperation(
  "rotateFromVector",
  (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(Math.atan2(
      optionalNumber(args, 1, 0),
      optionalNumber(args, 0, 0),
    ) * 180 / Math.PI),
  ),
);
export const scaleNonUniform = readonlyMatrixOperation(
  "scaleNonUniform",
  (matrix, args) => multiplyMatrices(
    matrix,
    scalingMatrix(
      optionalNumber(args, 0, 1),
      optionalNumber(args, 1, 1),
      1,
    ),
  ),
);
export const translate = readonlyMatrixOperation(
  "translate",
  (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  )),
);
