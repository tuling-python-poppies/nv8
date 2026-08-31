import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, scalingMatrix } from "./dom-matrix-state.js";
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
