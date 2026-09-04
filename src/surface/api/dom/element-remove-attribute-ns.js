import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { removeAttributeValueNS } from "./element-state.js";

export const removeAttributeNS = {
  removeAttributeNS(namespace, localName) {
    removeAttributeValueNS(this, namespace, localName);
    traceCall(
      "window.Element.prototype.removeAttributeNS",
      "Element",
      [namespace, localName],
      undefined,
    );
  },
}.removeAttributeNS;
registerNativeFunction(removeAttributeNS, "removeAttributeNS");
export function installElementRemoveAttributeNS() {
  definePrototypeMethod(Element.prototype, "removeAttributeNS", removeAttributeNS);
}
