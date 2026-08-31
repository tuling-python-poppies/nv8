import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { firstChildOf } from "./tree-walker-state.js";

export const firstChild = {
  firstChild() {
    const result = firstChildOf(this);
    traceCall(
      "window.TreeWalker.prototype.firstChild",
      "TreeWalker",
      [],
      result,
    );
    return result;
  },
}.firstChild;
registerNativeFunction(firstChild, "firstChild");
