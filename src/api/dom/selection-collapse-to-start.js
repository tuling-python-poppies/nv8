import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { collapseSelectionToEdge } from "./selection-state.js";
export const collapseToStart = { collapseToStart() {
  collapseSelectionToEdge(this, true);
  traceCall("window.Selection.prototype.collapseToStart", "Selection", [], undefined);
}}.collapseToStart;
registerNativeFunction(collapseToStart, "collapseToStart");
