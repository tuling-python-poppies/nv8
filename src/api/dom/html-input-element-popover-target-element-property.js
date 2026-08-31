import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { normalizeTarget } from "./html-button-element-state.js";
import { requireInput } from "./html-input-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get popoverTargetElement() {
    const result = requireInput(this).popoverTargetElement;
    traceGetter("window.HTMLInputElement.prototype.popoverTargetElement", "HTMLInputElement", result);
    return result;
  },
  set popoverTargetElement(value) {
    requireInput(this).popoverTargetElement = normalizeTarget(value);
  },
}, "popoverTargetElement");
export const popoverTargetElement = descriptor.get;
export const setPopoverTargetElement = descriptor.set;
registerNativeGetter(popoverTargetElement, "popoverTargetElement");
registerNativeFunction(setPopoverTargetElement, "set popoverTargetElement");
