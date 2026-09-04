import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { inputIsValid, inputWillValidate } from "./html-input-element-state.js";
export const reportValidity = { reportValidity() {
  const result = !inputWillValidate(this) || inputIsValid(this);
  if (!result) this.dispatchEvent(new Event("invalid", { cancelable: true }));
  traceCall("window.HTMLInputElement.prototype.reportValidity", "HTMLInputElement", [], result);
  return result;
}}.reportValidity;
registerNativeFunction(reportValidity, "reportValidity");
