import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { removeAttributeValue } from "./element-state.js";

export const removeAttribute = {
  removeAttribute(name) {
    removeAttributeValue(this, name);
    traceCall("window.Element.prototype.removeAttribute", "Element", [name], undefined);
  },
}.removeAttribute;
registerNativeFunction(removeAttribute, "removeAttribute");
export function installElementRemoveAttribute() {
  definePrototypeMethod(Element.prototype, "removeAttribute", removeAttribute);
}
