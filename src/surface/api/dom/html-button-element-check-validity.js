import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { buttonWillValidate, requireButton } from "./html-button-element-state.js";
export const checkValidity = { checkValidity() {
  const state = requireButton(this);
  const result = !buttonWillValidate(this) || state.customValidity === "";
  if (!result) this.dispatchEvent(new Event("invalid", { cancelable: true }));
  traceCall("window.HTMLButtonElement.prototype.checkValidity", "HTMLButtonElement", [], result);
  return result;
}}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
