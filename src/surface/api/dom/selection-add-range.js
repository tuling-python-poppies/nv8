import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { addSelectionRange } from "./selection-state.js";
export const addRange = { addRange(range) {
  addSelectionRange(this, range);
  traceCall("window.Selection.prototype.addRange", "Selection", [range], undefined);
}}.addRange;
registerNativeFunction(addRange, "addRange");
