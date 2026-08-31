import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { replaceChildrenAlgorithm } from "./parent-node-algorithms.js";

export const replaceChildren = {
  replaceChildren(...values) {
    replaceChildrenAlgorithm(this, values);
    traceCall("window.DocumentFragment.prototype.replaceChildren", "DocumentFragment", values, undefined);
  },
}.replaceChildren;
registerNativeFunction(replaceChildren, "replaceChildren");
