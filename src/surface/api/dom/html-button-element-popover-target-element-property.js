import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { normalizeTarget, requireButton } from "./html-button-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get popoverTargetElement() {
    const result = requireButton(this).popoverTargetElement;
    traceGetter("window.HTMLButtonElement.prototype.popoverTargetElement", "HTMLButtonElement", result);
    return result;
  },
  set popoverTargetElement(value) {
    requireButton(this).popoverTargetElement = normalizeTarget(value);
  },
}, "popoverTargetElement");
export const popoverTargetElement = descriptor.get;
export const setPopoverTargetElement = descriptor.set;
registerNativeGetter(popoverTargetElement, "popoverTargetElement");
registerNativeFunction(setPopoverTargetElement, "set popoverTargetElement");
