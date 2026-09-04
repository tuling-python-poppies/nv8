import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { removeSelectionRange } from "./selection-state.js";
export const removeRange = { removeRange(range) {
  removeSelectionRange(this, range);
  traceCall("window.Selection.prototype.removeRange", "Selection", [range], undefined);
}}.removeRange;
registerNativeFunction(removeRange, "removeRange");
