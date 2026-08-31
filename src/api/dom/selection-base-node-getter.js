import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const baseNode = Object.getOwnPropertyDescriptor({ get baseNode() {
  const value = selectionValue(this, "baseNode");
  traceGetter("window.Selection.prototype.baseNode", "Selection", value);
  return value;
}}, "baseNode").get;
registerNativeGetter(baseNode, "baseNode");
