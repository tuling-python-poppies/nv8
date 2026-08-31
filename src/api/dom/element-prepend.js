import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { prependAlgorithm } from "./parent-node-algorithms.js";

export const prepend = {
  prepend(...values) {
    prependAlgorithm(this, values);
    traceCall("window.Element.prototype.prepend", "Element", values, undefined);
  },
}.prepend;
registerNativeFunction(prepend, "prepend");
export function installElementPrepend() {
  definePrototypeMethod(Element.prototype, "prepend", prepend);
}
