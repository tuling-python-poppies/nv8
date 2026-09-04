import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { selectionContainsNode } from "./selection-state.js";
export const containsNode = { containsNode(node) {
  const partial = Boolean(arguments[1]);
  const result = selectionContainsNode(this, node, partial);
  traceCall("window.Selection.prototype.containsNode", "Selection", [node, partial], result);
  return result;
}}.containsNode;
registerNativeFunction(containsNode, "containsNode");
