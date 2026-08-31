import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const baseOffset = Object.getOwnPropertyDescriptor({ get baseOffset() {
  const value = selectionValue(this, "baseOffset");
  traceGetter("window.Selection.prototype.baseOffset", "Selection", value);
  return value;
}}, "baseOffset").get;
registerNativeGetter(baseOffset, "baseOffset");
