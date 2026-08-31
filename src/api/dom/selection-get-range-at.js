import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { selectionRangeAt } from "./selection-state.js";
export const getRangeAt = { getRangeAt(index) {
  const result = selectionRangeAt(this, index);
  traceCall("window.Selection.prototype.getRangeAt", "Selection", [index], result);
  return result;
}}.getRangeAt;
registerNativeFunction(getRangeAt, "getRangeAt");
