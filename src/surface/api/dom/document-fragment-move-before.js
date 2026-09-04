import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { insertNode, isNode, requireNode } from "./node-state.js";

export const moveBefore = {
  moveBefore(node, child) {
    requireNode(this);
    if (!isNode(node) || (child !== null && !isNode(child))) {
      throw new TypeError("The provided value is not a Node.");
    }
    insertNode(this, node, child);
    traceCall("window.DocumentFragment.prototype.moveBefore", "DocumentFragment", [node, child], undefined);
  },
}.moveBefore;
registerNativeFunction(moveBefore, "moveBefore");
