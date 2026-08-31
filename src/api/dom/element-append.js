import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { appendAlgorithm } from "./parent-node-algorithms.js";

export const append = {
  append(...values) {
    appendAlgorithm(this, values);
    traceCall("window.Element.prototype.append", "Element", values, undefined);
  },
}.append;
registerNativeFunction(append, "append");
export function installElementAppend() {
  definePrototypeMethod(Element.prototype, "append", append);
}
