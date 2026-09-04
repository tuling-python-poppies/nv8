import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
export const toString = { toString() {
  requireElement(this);
  const result = this.href;
  traceCall("window.HTMLAreaElement.prototype.toString", "HTMLAreaElement", [], result);
  return result;
}}.toString;
registerNativeFunction(toString, "toString");
