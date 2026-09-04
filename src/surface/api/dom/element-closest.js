import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { closestAlgorithm } from "./selector-engine.js";
import { Element } from "./element-constructor.js";

export const closest = {
  closest(selector) {
    const result = closestAlgorithm(this, selector);
    traceCall("window.Element.prototype.closest", "Element", [selector], result);
    return result;
  },
}.closest;
registerNativeFunction(closest, "closest");
export function installElementClosest() {
  definePrototypeMethod(Element.prototype, "closest", closest);
}
