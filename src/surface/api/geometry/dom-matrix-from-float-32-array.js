import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createDOMMatrix } from "./dom-matrix-constructor.js";
import { matrixFromValue } from "./dom-matrix-state.js";
export const fromFloat32Array = {
  fromFloat32Array(array32) {
    if (!(array32 instanceof Float32Array)) {
      throw new TypeError("Expected a Float32Array");
    }
    const result = createDOMMatrix(matrixFromValue(array32));
    traceCall("window.DOMMatrix.fromFloat32Array", "DOMMatrix", [array32], result);
    return result;
  },
}.fromFloat32Array;
registerNativeFunction(fromFloat32Array, "fromFloat32Array");
