import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { normalizeTarget, requireButton } from "./html-button-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get commandForElement() {
    const result = requireButton(this).commandForElement;
    traceGetter("window.HTMLButtonElement.prototype.commandForElement", "HTMLButtonElement", result);
    return result;
  },
  set commandForElement(value) {
    requireButton(this).commandForElement = normalizeTarget(value);
  },
}, "commandForElement");
export const commandForElement = descriptor.get;
export const setCommandForElement = descriptor.set;
registerNativeGetter(commandForElement, "commandForElement");
registerNativeFunction(setCommandForElement, "set commandForElement");
