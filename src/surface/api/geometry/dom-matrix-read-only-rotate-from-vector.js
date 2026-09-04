import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, rotationZMatrix } from "./dom-matrix-state.js";
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
