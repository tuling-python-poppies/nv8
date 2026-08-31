import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { setNamedItemAlgorithm } from "./named-node-map-state.js";

export const setAttributeNodeNS = {
  setAttributeNodeNS(attr) {
    const result = setNamedItemAlgorithm(
      requireElement(this).attributes,
      attr,
      true,
    );
    traceCall("window.Element.prototype.setAttributeNodeNS", "Element", [attr], result);
    return result;
  },
}.setAttributeNodeNS;
registerNativeFunction(setAttributeNodeNS, "setAttributeNodeNS");
export function installElementSetAttributeNodeNS() {
  definePrototypeMethod(Element.prototype, "setAttributeNodeNS", setAttributeNodeNS);
}
