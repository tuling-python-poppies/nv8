import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { beforeAlgorithm } from "./character-data-algorithms.js";
import { Element } from "./element-constructor.js";

export const before = {
  before(...values) {
    beforeAlgorithm(this, values);
    traceCall("window.Element.prototype.before", "Element", values, undefined);
  },
}.before;
registerNativeFunction(before, "before");
export function installElementBefore() {
  definePrototypeMethod(Element.prototype, "before", before);
}
