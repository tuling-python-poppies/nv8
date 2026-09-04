import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { axisRotationMatrix, multiplyMatrices } from "./dom-matrix-state.js";
export const rotateAxisAngleSelf = matrixSelfOperation(
  "rotateAxisAngleSelf",
  (matrix, args) => multiplyMatrices(matrix, axisRotationMatrix(
    optionalNumber(args, 0, 0),
    optionalNumber(args, 1, 0),
    optionalNumber(args, 2, 0),
    optionalNumber(args, 3, 0),
  )),
);
