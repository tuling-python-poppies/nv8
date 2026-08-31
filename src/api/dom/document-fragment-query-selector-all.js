import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { querySelectorAllAlgorithm } from "./selector-engine.js";

export const querySelectorAll = {
  querySelectorAll(selector) {
    const result = querySelectorAllAlgorithm(this, selector);
    traceCall("window.DocumentFragment.prototype.querySelectorAll", "DocumentFragment", [selector], result);
    return result;
  },
}.querySelectorAll;
registerNativeFunction(querySelectorAll, "querySelectorAll");
