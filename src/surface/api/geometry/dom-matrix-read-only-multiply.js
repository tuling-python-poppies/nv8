import { readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { matrixFromValue, multiplyMatrices } from "./dom-matrix-state.js";
export const multiply = readonlyMatrixOperation(
  "multiply",
  (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0])),
);
