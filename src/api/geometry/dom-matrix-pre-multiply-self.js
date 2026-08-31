import { matrixSelfOperation } from "./dom-matrix-self-operation.js";
import { matrixFromValue, multiplyMatrices } from "./dom-matrix-state.js";
export const preMultiplySelf = matrixSelfOperation(
  "preMultiplySelf",
  (matrix, args) => multiplyMatrices(matrixFromValue(args[0]), matrix),
);
