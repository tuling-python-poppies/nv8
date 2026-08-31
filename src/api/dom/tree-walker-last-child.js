import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { lastChildOf } from "./tree-walker-state.js";

export const lastChild = {
  lastChild() {
    const result = lastChildOf(this);
    traceCall(
      "window.TreeWalker.prototype.lastChild",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.lastChild;
registerNativeFunction(lastChild, "lastChild");
