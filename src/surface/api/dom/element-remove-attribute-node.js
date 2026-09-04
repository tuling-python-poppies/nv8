import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireAttr } from "./attr-state.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import {
  namedItem,
  removeNamedItemAlgorithm,
} from "./named-node-map-state.js";

export const removeAttributeNode = {
  removeAttributeNode(attr) {
    const name = requireAttr(attr).name;
    const map = requireElement(this).attributes;
    if (namedItem(map, name) !== attr) {
      throw new DOMException("The attribute was not found.", "NotFoundError");
    }
    const result = removeNamedItemAlgorithm(map, name);
    traceCall("window.Element.prototype.removeAttributeNode", "Element", [attr], result);
    return result;
  },
}.removeAttributeNode;
registerNativeFunction(removeAttributeNode, "removeAttributeNode");
export function installElementRemoveAttributeNode() {
  definePrototypeMethod(Element.prototype, "removeAttributeNode", removeAttributeNode);
}
