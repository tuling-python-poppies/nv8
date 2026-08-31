import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireButton } from "./html-button-element-state.js";
export const form = Object.getOwnPropertyDescriptor({ get form() {
  requireButton(this);
  const result = formOwnerOf(this);
  traceGetter("window.HTMLButtonElement.prototype.form", "HTMLButtonElement", result);
  return result;
}}, "form").get;
registerNativeGetter(form, "form");
