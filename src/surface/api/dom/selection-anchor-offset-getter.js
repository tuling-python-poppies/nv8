import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const anchorOffset = Object.getOwnPropertyDescriptor({ get anchorOffset() {
  const value = selectionValue(this, "anchorOffset");
  traceGetter("window.Selection.prototype.anchorOffset", "Selection", value);
  return value;
}}, "anchorOffset").get;
registerNativeGetter(anchorOffset, "anchorOffset");
