import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { previousIteratorNode } from "./node-iterator-state.js";

export const previousNode = {
  previousNode() {
    const result = previousIteratorNode(this);
    traceCall(
      "window.NodeIterator.prototype.previousNode",
      "NodeIterator",
      [],
      result,
    );
    return result;
  },
}.previousNode;
registerNativeFunction(previousNode, "previousNode");
