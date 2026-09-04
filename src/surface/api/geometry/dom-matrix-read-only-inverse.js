import { readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { invertMatrix } from "./dom-matrix-state.js";
export const inverse = readonlyMatrixOperation("inverse", invertMatrix);
