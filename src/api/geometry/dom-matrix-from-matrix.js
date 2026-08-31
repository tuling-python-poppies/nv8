import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createDOMMatrix } from "./dom-matrix-constructor.js";
import { matrixFromValue } from "./dom-matrix-state.js";
export const fromMatrix = {
  fromMatrix() {
    const result = createDOMMatrix(matrixFromValue(arguments[0]));
    traceCall(
      "window.DOMMatrix.fromMatrix",
      "DOMMatrix",
      arguments[0] === undefined ? [] : [arguments[0]],
      result,
    );
    return result;
  },
}.fromMatrix;
registerNativeFunction(fromMatrix, "fromMatrix");
