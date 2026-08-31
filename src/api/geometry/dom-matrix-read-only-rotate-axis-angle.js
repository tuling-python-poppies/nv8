import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { axisRotationMatrix, multiplyMatrices } from "./dom-matrix-state.js";
export const rotateAxisAngle = readonlyMatrixOperation(
  "rotateAxisAngle",
  (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  )),
);
