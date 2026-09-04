import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { matrixFromValue, requireDOMMatrix } from "./dom-matrix-state.js";
export const setMatrixValue = {
  setMatrixValue(transformList) {
    const values = matrixFromValue(`${transformList}`);
    const matrix = requireDOMMatrix(this);
    matrix.splice(0, matrix.length, ...values);
    traceCall(
      "window.DOMMatrix.prototype.setMatrixValue",
      "DOMMatrix",
      [transformList],
      this,
    );
    return this;
  },
}.setMatrixValue;
registerNativeFunction(setMatrixValue, "setMatrixValue");
