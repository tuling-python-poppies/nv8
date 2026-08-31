import { readonlyMatrixValueOperation } from "./dom-matrix-read-only-operation.js";
export const toFloat32Array = readonlyMatrixValueOperation(
  "toFloat32Array",
  matrix => new Float32Array(matrix),
);
