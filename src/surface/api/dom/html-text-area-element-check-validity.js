import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { textAreaIsValid, textAreaWillValidate } from "./html-text-area-element-state.js";
export const checkValidity = { checkValidity() {
  const result = !textAreaWillValidate(this) || textAreaIsValid(this);
  if (!result) this.dispatchEvent(new Event("invalid", { cancelable: true }));
  traceCall("window.HTMLTextAreaElement.prototype.checkValidity", "HTMLTextAreaElement", [], result);
  return result;
}}.checkValidity;
registerNativeFunction(checkValidity, "checkValidity");
