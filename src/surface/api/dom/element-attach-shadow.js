import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { createShadowRoot } from "./shadow-root-state.js";

export const attachShadow = {
  attachShadow(init) {
    requireElement(this);
    if (init === undefined || init === null) {
      throw new TypeError(
        "Failed to execute 'attachShadow' on 'Element': 1 argument required.",
      );
    }
    const result = createShadowRoot(this, Object(init));
    traceCall(
      "window.Element.prototype.attachShadow",
      "Element",
      [init],
      result,
    );
    return result;
  },
}.attachShadow;
registerNativeFunction(attachShadow, "attachShadow");

export function installElementAttachShadow() {
  definePrototypeMethod(Element.prototype, "attachShadow", attachShadow);
}
