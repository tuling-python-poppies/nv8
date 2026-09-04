import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { querySelectorAllAlgorithm } from "./selector-engine.js";

export const querySelectorAll = {
  querySelectorAll(selector) {
    const result = querySelectorAllAlgorithm(this, selector);
    traceCall("window.Element.prototype.querySelectorAll", "Element", [selector], result);
    return result;
  },
}.querySelectorAll;
registerNativeFunction(querySelectorAll, "querySelectorAll");
export function installElementQuerySelectorAll() {
  definePrototypeMethod(Element.prototype, "querySelectorAll", querySelectorAll);
}
