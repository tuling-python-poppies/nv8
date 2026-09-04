import { readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, scalingMatrix } from "./dom-matrix-state.js";
export const flipX = readonlyMatrixOperation(
  "flipX",
  matrix => multiplyMatrices(matrix, scalingMatrix(-1, 1, 1)),
);
