import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { namedItem } from "./named-node-map-state.js";

export const getAttributeNode = {
  getAttributeNode(name) {
    const result = namedItem(requireElement(this).attributes, name);
    traceCall("window.Element.prototype.getAttributeNode", "Element", [name], result);
    return result;
  },
}.getAttributeNode;
registerNativeFunction(getAttributeNode, "getAttributeNode");
export function installElementGetAttributeNode() {
  definePrototypeMethod(Element.prototype, "getAttributeNode", getAttributeNode);
}
