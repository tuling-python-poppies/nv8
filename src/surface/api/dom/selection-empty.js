import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { clearSelection } from "./selection-state.js";
export const empty = { empty() {
  clearSelection(this);
  traceCall("window.Selection.prototype.empty", "Selection", [], undefined);
}}.empty;
registerNativeFunction(empty, "empty");
