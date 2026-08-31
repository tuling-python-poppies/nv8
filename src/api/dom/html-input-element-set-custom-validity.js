import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const setCustomValidity = { setCustomValidity(error) {
  requireInput(this).customValidity = `${error}`;
  traceCall("window.HTMLInputElement.prototype.setCustomValidity", "HTMLInputElement", [error], undefined);
}}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
