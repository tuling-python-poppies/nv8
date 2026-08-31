import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { querySelectorAlgorithm } from "./selector-engine.js";

export const querySelector = {
  querySelector(selector) {
    const result = querySelectorAlgorithm(this, selector);
    traceCall("window.DocumentFragment.prototype.querySelector", "DocumentFragment", [selector], result);
    return result;
  },
}.querySelector;
registerNativeFunction(querySelector, "querySelector");
