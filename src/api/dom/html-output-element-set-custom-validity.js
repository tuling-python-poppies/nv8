import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireOutput } from "./html-output-element-state.js";

export const setCustomValidity = {
  setCustomValidity(error) {
    requireOutput(this).customValidity = `${error}`;
    traceCall(
      "window.HTMLOutputElement.prototype.setCustomValidity",
      "HTMLOutputElement",
      [error],
      undefined,
    );
  },
}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
