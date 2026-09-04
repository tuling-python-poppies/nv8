import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { getAttributeValueNS } from "./element-state.js";

export const hasAttributeNS = {
  hasAttributeNS(namespace, localName) {
    const result = getAttributeValueNS(this, namespace, localName) !== null;
    traceCall(
      "window.Element.prototype.hasAttributeNS",
      "Element",
      [namespace, localName],
      result,
    );
    return result;
  },
}.hasAttributeNS;
registerNativeFunction(hasAttributeNS, "hasAttributeNS");
export function installElementHasAttributeNS() {
  definePrototypeMethod(Element.prototype, "hasAttributeNS", hasAttributeNS);
}
