import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { replaceChildrenAlgorithm } from "./parent-node-algorithms.js";

export const replaceChildren = {
  replaceChildren(...values) {
    replaceChildrenAlgorithm(this, values);
    traceCall(
      "window.Element.prototype.replaceChildren",
      "Element",
      values,
      undefined,
    );
  },
}.replaceChildren;
registerNativeFunction(replaceChildren, "replaceChildren");
export function installElementReplaceChildren() {
  definePrototypeMethod(Element.prototype, "replaceChildren", replaceChildren);
}
