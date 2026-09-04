import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { attributeNames } from "./element-state.js";

export const hasAttributes = {
  hasAttributes() {
    const result = attributeNames(this).length !== 0;
    traceCall("window.Element.prototype.hasAttributes", "Element", [], result);
    return result;
  },
}.hasAttributes;
registerNativeFunction(hasAttributes, "hasAttributes");
export function installElementHasAttributes() {
  definePrototypeMethod(Element.prototype, "hasAttributes", hasAttributes);
}
