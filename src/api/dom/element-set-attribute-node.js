import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { setNamedItemAlgorithm } from "./named-node-map-state.js";

export const setAttributeNode = {
  setAttributeNode(attr) {
    const result = setNamedItemAlgorithm(requireElement(this).attributes, attr);
    traceCall("window.Element.prototype.setAttributeNode", "Element", [attr], result);
    return result;
  },
}.setAttributeNode;
registerNativeFunction(setAttributeNode, "setAttributeNode");
export function installElementSetAttributeNode() {
  definePrototypeMethod(Element.prototype, "setAttributeNode", setAttributeNode);
}
