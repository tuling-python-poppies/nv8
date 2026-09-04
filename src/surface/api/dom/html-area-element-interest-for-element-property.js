import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { normalizeTarget } from "./html-button-element-state.js";
import { requireElement } from "./element-state.js";
const values = new WeakMap();
const descriptor = Object.getOwnPropertyDescriptor({
  get interestForElement() {
    requireElement(this);
    const result = values.get(this) ?? null;
    traceGetter("window.HTMLAreaElement.prototype.interestForElement", "HTMLAreaElement", result);
    return result;
  },
  set interestForElement(value) {
    requireElement(this);
    values.set(this, normalizeTarget(value));
  },
}, "interestForElement");
export const interestForElement = descriptor.get;
export const setInterestForElement = descriptor.set;
registerNativeGetter(interestForElement, "interestForElement");
registerNativeFunction(setInterestForElement, "set interestForElement");
