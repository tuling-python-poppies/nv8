import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDOMPoint } from "./dom-point-state.js";
export const toJSON = {
  toJSON() {
    const { x, y, z, w } = requireDOMPoint(this);
    const result = { x, y, z, w };
    traceCall("window.DOMPointReadOnly.prototype.toJSON", "DOMPointReadOnly", [], result);
    return result;
  },
}.toJSON;
registerNativeFunction(toJSON, "toJSON");
