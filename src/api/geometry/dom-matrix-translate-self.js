import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { multiplyMatrices, translationMatrix } from "./dom-matrix-state.js";
export const translateSelf = matrixSelfOperation(
  "translateSelf",
  (matrix, args) => multiplyMatrices(matrix, translationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
  )),
);
