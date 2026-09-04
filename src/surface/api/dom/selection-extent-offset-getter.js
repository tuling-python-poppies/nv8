import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const extentOffset = Object.getOwnPropertyDescriptor({ get extentOffset() {
  const value = selectionValue(this, "extentOffset");
  traceGetter("window.Selection.prototype.extentOffset", "Selection", value);
  return value;
}}, "extentOffset").get;
registerNativeGetter(extentOffset, "extentOffset");
