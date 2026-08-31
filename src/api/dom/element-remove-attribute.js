import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
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
