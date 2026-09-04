import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { selectionText } from "./selection-state.js";
export const toString = { toString() {
  const result = selectionText(this);
  traceCall("window.Selection.prototype.toString", "Selection", [], result);
  return result;
}}.toString;
registerNativeFunction(toString, "toString");
