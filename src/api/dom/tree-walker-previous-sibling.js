import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { previousSiblingOf } from "./tree-walker-state.js";

export const previousSibling = {
  previousSibling() {
    const result = previousSiblingOf(this);
    traceCall(
      "window.TreeWalker.prototype.previousSibling",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.previousSibling;
registerNativeFunction(previousSibling, "previousSibling");
