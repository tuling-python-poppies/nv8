import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { replaceWithAlgorithm } from "./character-data-algorithms.js";
import { Element } from "./element-constructor.js";

export const replaceWith = {
  replaceWith(...values) {
    replaceWithAlgorithm(this, values);
    traceCall("window.Element.prototype.replaceWith", "Element", values, undefined);
  },
}.replaceWith;
registerNativeFunction(replaceWith, "replaceWith");
export function installElementReplaceWith() {
  definePrototypeMethod(Element.prototype, "replaceWith", replaceWith);
}
