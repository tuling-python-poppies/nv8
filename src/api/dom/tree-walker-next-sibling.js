import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { nextSiblingOf } from "./tree-walker-state.js";

export const nextSibling = {
  nextSibling() {
    const result = nextSiblingOf(this);
    traceCall(
      "window.TreeWalker.prototype.nextSibling",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.nextSibling;
registerNativeFunction(nextSibling, "nextSibling");
