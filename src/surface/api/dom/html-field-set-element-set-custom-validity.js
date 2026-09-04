import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const setCustomValidity = {
  setCustomValidity(error) {
    requireFieldSet(this).customValidity = `${error}`;
    traceCall(
      "window.HTMLFieldSetElement.prototype.setCustomValidity",
      "HTMLFieldSetElement",
      [error],
      undefined,
    );
  },
}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
