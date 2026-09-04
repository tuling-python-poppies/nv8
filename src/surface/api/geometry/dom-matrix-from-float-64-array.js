import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createDOMMatrix } from "./dom-matrix-constructor.js";
import { matrixFromValue } from "./dom-matrix-state.js";
export const fromFloat64Array = {
  fromFloat64Array(array64) {
    if (!(array64 instanceof Float64Array)) {
      throw new TypeError("Expected a Float64Array");
    }
    const result = createDOMMatrix(matrixFromValue(array64));
    traceCall("window.DOMMatrix.fromFloat64Array", "DOMMatrix", [array64], result);
    return result;
  },
}.fromFloat64Array;
registerNativeFunction(fromFloat64Array, "fromFloat64Array");
