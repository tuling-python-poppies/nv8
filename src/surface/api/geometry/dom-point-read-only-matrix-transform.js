import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createDOMPoint } from "./dom-point-constructor.js";
import { requireDOMPoint } from "./dom-point-state.js";
import { identityMatrix, matrixFromValue } from "./dom-matrix-state.js";
export const matrixTransform = {
  matrixTransform() {
    const point = requireDOMPoint(this);
    const matrix = arguments[0] === undefined
      ? identityMatrix()
      : matrixFromValue(arguments[0]);
    const result = createDOMPoint(
      point.x * matrix[0] + point.y * matrix[4] + point.z * matrix[8] + point.w * matrix[12],
      point.x * matrix[1] + point.y * matrix[5] + point.z * matrix[9] + point.w * matrix[13],
      point.x * matrix[2] + point.y * matrix[6] + point.z * matrix[10] + point.w * matrix[14],
      point.x * matrix[3] + point.y * matrix[7] + point.z * matrix[11] + point.w * matrix[15],
    );
    traceCall(
      "window.DOMPointReadOnly.prototype.matrixTransform",
      "DOMPointReadOnly",
      arguments[0] === undefined ? [] : [arguments[0]],
      result,
    );
    return result;
  },
}.matrixTransform;
registerNativeFunction(matrixTransform, "matrixTransform");
