import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const extentNode = Object.getOwnPropertyDescriptor({ get extentNode() {
  const value = selectionValue(this, "extentNode");
  traceGetter("window.Selection.prototype.extentNode", "Selection", value);
  return value;
}}, "extentNode").get;
registerNativeGetter(extentNode, "extentNode");
