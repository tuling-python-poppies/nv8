import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { nextNodeOf } from "./tree-walker-state.js";

export const nextNode = {
  nextNode() {
    const result = nextNodeOf(this);
    traceCall(
      "window.TreeWalker.prototype.nextNode",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.nextNode;
registerNativeFunction(nextNode, "nextNode");
