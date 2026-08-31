import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireSelection } from "./selection-state.js";
export const getComposedRanges = { getComposedRanges() {
  const state = requireSelection(this);
  const result = state.range === null ? [] : [state.range.cloneRange()];
  traceCall("window.Selection.prototype.getComposedRanges", "Selection", [], result);
  return result;
}}.getComposedRanges;
registerNativeFunction(getComposedRanges, "getComposedRanges");
