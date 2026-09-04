import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { extendSelection } from "./selection-state.js";
export const extend = { extend(node) {
  const offset = arguments[1] ?? 0;
  extendSelection(this, node, offset);
  traceCall("window.Selection.prototype.extend", "Selection", [node, offset], undefined);
}}.extend;
registerNativeFunction(extend, "extend");
