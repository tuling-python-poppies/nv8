import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { collapseSelectionToEdge } from "./selection-state.js";
export const collapseToEnd = { collapseToEnd() {
  collapseSelectionToEdge(this, false);
  traceCall("window.Selection.prototype.collapseToEnd", "Selection", [], undefined);
}}.collapseToEnd;
registerNativeFunction(collapseToEnd, "collapseToEnd");
