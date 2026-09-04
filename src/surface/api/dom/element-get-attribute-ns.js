import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { getAttributeValueNS } from "./element-state.js";

export const getAttributeNS = {
  getAttributeNS(namespace, localName) {
    const result = getAttributeValueNS(this, namespace, localName);
    traceCall(
      "window.Element.prototype.getAttributeNS",
      "Element",
      [namespace, localName],
      result,
    );
    return result;
  },
}.getAttributeNS;
registerNativeFunction(getAttributeNS, "getAttributeNS");
export function installElementGetAttributeNS() {
  definePrototypeMethod(Element.prototype, "getAttributeNS", getAttributeNS);
}
