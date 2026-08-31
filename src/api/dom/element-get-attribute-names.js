import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { attributeNames } from "./element-state.js";

export const getAttributeNames = {
  getAttributeNames() {
    const result = attributeNames(this);
    traceCall("window.Element.prototype.getAttributeNames", "Element", [], result);
    return result;
  },
}.getAttributeNames;
registerNativeFunction(getAttributeNames, "getAttributeNames");
export function installElementGetAttributeNames() {
  definePrototypeMethod(Element.prototype, "getAttributeNames", getAttributeNames);
}
