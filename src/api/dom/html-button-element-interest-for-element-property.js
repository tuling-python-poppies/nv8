import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { normalizeTarget, requireButton } from "./html-button-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get interestForElement() {
    const result = requireButton(this).interestForElement;
    traceGetter("window.HTMLButtonElement.prototype.interestForElement", "HTMLButtonElement", result);
    return result;
  },
  set interestForElement(value) {
    requireButton(this).interestForElement = normalizeTarget(value);
  },
}, "interestForElement");
export const interestForElement = descriptor.get;
export const setInterestForElement = descriptor.set;
registerNativeGetter(interestForElement, "interestForElement");
registerNativeFunction(setInterestForElement, "set interestForElement");
