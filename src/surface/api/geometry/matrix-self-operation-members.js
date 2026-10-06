// geometry 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

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

export const invertSelf = matrixSelfOperation("invertSelf", invertMatrix);
export const multiplySelf = matrixSelfOperation(
  "multiplySelf",
  (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0])),
);
export const preMultiplySelf = matrixSelfOperation(
  "preMultiplySelf",
  (matrix, args) => multiplyMatrices(matrixFromValue(args[0]), matrix),
);
export const rotateAxisAngleSelf = matrixSelfOperation(
  "rotateAxisAngleSelf",
  (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  )),
);
export const rotateFromVectorSelf = matrixSelfOperation(
  "rotateFromVectorSelf",
  (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(Math.atan2(
      optionalNumber(args, 1, 0),
      optionalNumber(args, 0, 0),
    ) * 180 / Math.PI),
  ),
);
export const rotateSelf = matrixSelfOperation(
  "rotateSelf",
  (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(optionalNumber(args, 0, 0)),
  ),
);
export const translateSelf = matrixSelfOperation(
  "translateSelf",
  (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  )),
);
