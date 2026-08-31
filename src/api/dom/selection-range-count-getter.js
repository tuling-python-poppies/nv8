import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const rangeCount = Object.getOwnPropertyDescriptor({ get rangeCount() {
  const value = selectionValue(this, "rangeCount");
  traceGetter("window.Selection.prototype.rangeCount", "Selection", value);
  return value;
}}, "rangeCount").get;
registerNativeGetter(rangeCount, "rangeCount");
