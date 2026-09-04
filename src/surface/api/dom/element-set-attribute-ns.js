import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { setAttributeValueNS } from "./element-state.js";

export const setAttributeNS = {
  setAttributeNS(namespace, qualifiedName, value) {
    setAttributeValueNS(this, namespace, qualifiedName, `${value}`);
    traceCall(
      "window.Element.prototype.setAttributeNS",
      "Element",
      [namespace, qualifiedName, value],
      undefined,
    );
  },
}.setAttributeNS;
registerNativeFunction(setAttributeNS, "setAttributeNS");
export function installElementSetAttributeNS() {
  definePrototypeMethod(Element.prototype, "setAttributeNS", setAttributeNS);
}
