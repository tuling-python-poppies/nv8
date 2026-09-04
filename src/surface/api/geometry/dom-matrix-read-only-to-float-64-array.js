import { readonlyMatrixValueOperation } from "./dom-matrix-read-only-operation.js";
export const toFloat64Array = readonlyMatrixValueOperation(
  "toFloat64Array",
  matrix => new Float64Array(matrix),
);
