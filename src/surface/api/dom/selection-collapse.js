import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { collapseSelection } from "./selection-state.js";
export const collapse = { collapse(node) {
  const offset = arguments[1] ?? 0;
  collapseSelection(this, node, offset);
  traceCall("window.Selection.prototype.collapse", "Selection", [node, offset], undefined);
}}.collapse;
registerNativeFunction(collapse, "collapse");
