import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { buttonWillValidate, requireButton } from "./html-button-element-state.js";
export const validationMessage = Object.getOwnPropertyDescriptor({ get validationMessage() {
  const state = requireButton(this);
  const result = buttonWillValidate(this) ? state.customValidity : "";
  traceGetter("window.HTMLButtonElement.prototype.validationMessage", "HTMLButtonElement", result);
  return result;
}}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
