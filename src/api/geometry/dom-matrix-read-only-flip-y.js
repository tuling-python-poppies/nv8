import { readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, scalingMatrix } from "./dom-matrix-state.js";
export const flipY = readonlyMatrixOperation(
  "flipY",
  matrix => multiplyMatrices(matrix, scalingMatrix(1, -1, 1)),
);
