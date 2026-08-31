import { matrixSelfOperation } from "./dom-matrix-self-operation.js";
import { matrixFromValue, multiplyMatrices } from "./dom-matrix-state.js";
export const multiplySelf = matrixSelfOperation(
  "multiplySelf",
  (matrix, args) => multiplyMatrices(matrix, matrixFromValue(args[0])),
);
