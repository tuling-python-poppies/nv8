import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { nextIteratorNode } from "./node-iterator-state.js";

export const nextNode = {
  nextNode() {
    const result = nextIteratorNode(this);
    traceCall(
      "window.NodeIterator.prototype.nextNode",
      "NodeIterator",
      [],
      result,
    );
    return result;
  },
}.nextNode;
registerNativeFunction(nextNode, "nextNode");
