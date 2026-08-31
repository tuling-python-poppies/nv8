import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { clearSelection } from "./selection-state.js";
export const removeAllRanges = { removeAllRanges() {
  clearSelection(this);
  traceCall("window.Selection.prototype.removeAllRanges", "Selection", [], undefined);
}}.removeAllRanges;
registerNativeFunction(removeAllRanges, "removeAllRanges");
