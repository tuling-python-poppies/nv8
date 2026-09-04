import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { multiplyMatrices, rotationZMatrix } from "./dom-matrix-state.js";
export const rotateSelf = matrixSelfOperation(
  "rotateSelf",
  (matrix, args) => multiplyMatrices(
    matrix,
    rotationZMatrix(optionalNumber(args, 0, 0)),
  ),
);
