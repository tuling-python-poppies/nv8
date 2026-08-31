import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { identityMatrix, multiplyMatrices } from "./dom-matrix-state.js";
export const skewX = readonlyMatrixOperation("skewX", (matrix, args) => {
  const skew = identityMatrix();
  skew[4] = Math.tan(optionalNumber(args, 0, 0) * Math.PI / 180);
  return multiplyMatrices(matrix, skew);
});
