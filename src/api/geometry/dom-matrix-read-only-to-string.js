import { readonlyMatrixValueOperation } from "./dom-matrix-read-only-operation.js";
import { is2DMatrix } from "./dom-matrix-state.js";
export const toString = readonlyMatrixValueOperation(
  "toString",
  matrix => is2DMatrix(matrix)
    ? `matrix(${[
        matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13],
      ].join(", ")})`
    : `matrix3d(${matrix.join(", ")})`,
);
