import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { removeAlgorithm } from "./character-data-algorithms.js";
import { Element } from "./element-constructor.js";

export const remove = {
  remove() {
    removeAlgorithm(this);
    traceCall("window.Element.prototype.remove", "Element", [], undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");
export function installElementRemove() {
  definePrototypeMethod(Element.prototype, "remove", remove);
}
