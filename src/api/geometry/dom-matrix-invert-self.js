import { matrixSelfOperation } from "./dom-matrix-self-operation.js";
import { invertMatrix } from "./dom-matrix-state.js";
export const invertSelf = matrixSelfOperation("invertSelf", invertMatrix);
