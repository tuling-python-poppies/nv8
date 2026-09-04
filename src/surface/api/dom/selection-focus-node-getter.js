import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const focusNode = Object.getOwnPropertyDescriptor({ get focusNode() {
  const value = selectionValue(this, "focusNode");
  traceGetter("window.Selection.prototype.focusNode", "Selection", value);
  return value;
}}, "focusNode").get;
registerNativeGetter(focusNode, "focusNode");
