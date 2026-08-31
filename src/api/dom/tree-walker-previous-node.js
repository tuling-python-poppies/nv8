import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { previousNodeOf } from "./tree-walker-state.js";

export const previousNode = {
  previousNode() {
    const result = previousNodeOf(this);
    traceCall(
      "window.TreeWalker.prototype.previousNode",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.previousNode;
registerNativeFunction(previousNode, "previousNode");
