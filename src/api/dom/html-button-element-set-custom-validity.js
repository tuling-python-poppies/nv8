import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
export const setCustomValidity = { setCustomValidity(error) {
  requireButton(this).customValidity = `${error}`;
  traceCall("window.HTMLButtonElement.prototype.setCustomValidity", "HTMLButtonElement", [error], undefined);
}}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
