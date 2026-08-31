import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const setCustomValidity = {
  setCustomValidity(message) {
    if (arguments.length < 1) {
      throw new TypeError("1 argument required");
    }
    requireObjectElement(this).customValidity = `${message}`;
    traceCall(
      "window.HTMLObjectElement.prototype.setCustomValidity",
      "HTMLObjectElement",
      [message],
      undefined,
    );
  },
}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
