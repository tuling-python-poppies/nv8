import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { afterAlgorithm } from "./character-data-algorithms.js";
import { Element } from "./element-constructor.js";

export const after = {
  after(...values) {
    afterAlgorithm(this, values);
    traceCall("window.Element.prototype.after", "Element", values, undefined);
  },
}.after;
registerNativeFunction(after, "after");
export function installElementAfter() {
  definePrototypeMethod(Element.prototype, "after", after);
}
