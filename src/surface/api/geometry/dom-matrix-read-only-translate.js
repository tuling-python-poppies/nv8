import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, translationMatrix } from "./dom-matrix-state.js";
export const translate = readonlyMatrixOperation(
  "translate",
  (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  )),
);
