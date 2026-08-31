import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const focusOffset = Object.getOwnPropertyDescriptor({ get focusOffset() {
  const value = selectionValue(this, "focusOffset");
  traceGetter("window.Selection.prototype.focusOffset", "Selection", value);
  return value;
}}, "focusOffset").get;
registerNativeGetter(focusOffset, "focusOffset");
