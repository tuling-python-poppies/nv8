import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const anchorNode = Object.getOwnPropertyDescriptor({ get anchorNode() {
  const value = selectionValue(this, "anchorNode");
  traceGetter("window.Selection.prototype.anchorNode", "Selection", value);
  return value;
}}, "anchorNode").get;
registerNativeGetter(anchorNode, "anchorNode");
