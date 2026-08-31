import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { inputIsValid, inputWillValidate } from "./html-input-element-state.js";
export const checkValidity = { checkValidity() {
  const result = !inputWillValidate(this) || inputIsValid(this);
  if (!result) this.dispatchEvent(new Event("invalid", { cancelable: true }));
  traceCall("window.HTMLInputElement.prototype.checkValidity", "HTMLInputElement", [], result);
  return result;
}}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
