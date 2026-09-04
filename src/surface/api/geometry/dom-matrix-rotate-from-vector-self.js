import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { multiplyMatrices, rotationZMatrix } from "./dom-matrix-state.js";
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
