import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const setCustomValidity = { setCustomValidity(error) {
  requireTextArea(this).customValidity = `${error}`;
  traceCall("window.HTMLTextAreaElement.prototype.setCustomValidity", "HTMLTextAreaElement", [error], undefined);
}}.setCustomValidity;
registerNativeFunction(setCustomValidity, "setCustomValidity");
