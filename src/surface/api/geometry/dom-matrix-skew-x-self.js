import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { identityMatrix, multiplyMatrices } from "./dom-matrix-state.js";
export const skewXSelf = matrixSelfOperation("skewXSelf", (matrix, args) => {
  const skew = identityMatrix();
  skew[4] = Math.tan(optionalNumber(args, 0, 0) * Math.PI / 180);
  return multiplyMatrices(matrix, skew);
});
