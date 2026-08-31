import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  is2DMatrix,
  isIdentityMatrix,
  requireDOMMatrix,
} from "./dom-matrix-state.js";

export function matrixBooleanGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const matrix = requireDOMMatrix(this);
      const result = propertyName === "is2D"
        ? is2DMatrix(matrix)
        : isIdentityMatrix(matrix);
      traceGetter(
        `window.DOMMatrixReadOnly.prototype.${propertyName}`,
        "DOMMatrixReadOnly",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
