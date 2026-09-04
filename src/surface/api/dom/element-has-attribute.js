import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { getAttributeValue } from "./element-state.js";

export const hasAttribute = {
  hasAttribute(name) {
    const result = getAttributeValue(this, name) !== null;
    traceCall("window.Element.prototype.hasAttribute", "Element", [name], result);
    return result;
  },
}.hasAttribute;
registerNativeFunction(hasAttribute, "hasAttribute");
export function installElementHasAttribute() {
  definePrototypeMethod(Element.prototype, "hasAttribute", hasAttribute);
}
