import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { parentOf } from "./tree-walker-state.js";

export const parentNode = {
  parentNode() {
    const result = parentOf(this);
    traceCall(
      "window.TreeWalker.prototype.parentNode",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.parentNode;
registerNativeFunction(parentNode, "parentNode");
