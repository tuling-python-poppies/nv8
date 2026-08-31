import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { namedItemNS } from "./named-node-map-state.js";

export const getAttributeNodeNS = {
  getAttributeNodeNS(namespace, localName) {
    const result = namedItemNS(requireElement(this).attributes, namespace, localName);
    traceCall(
      "window.Element.prototype.getAttributeNodeNS",
      "Element",
      [namespace, localName],
      result,
    );
    return result;
  },
}.getAttributeNodeNS;
registerNativeFunction(getAttributeNodeNS, "getAttributeNodeNS");
export function installElementGetAttributeNodeNS() {
  definePrototypeMethod(Element.prototype, "getAttributeNodeNS", getAttributeNodeNS);
}
