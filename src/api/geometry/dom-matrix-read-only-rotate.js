import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, rotationZMatrix } from "./dom-matrix-state.js";
export const rotate = readonlyMatrixOperation("rotate", (matrix, args) => {
  const angle = args[1] === undefined && args[2] === undefined
    ? optionalNumber(args, 0, 0)
    : optionalNumber(args, 2, 0);
  return multiplyMatrices(matrix, rotationZMatrix(angle));
});
