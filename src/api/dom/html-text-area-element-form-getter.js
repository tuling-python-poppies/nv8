import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const form = Object.getOwnPropertyDescriptor({ get form() {
  requireTextArea(this);
  const result = formOwnerOf(this);
  traceGetter("window.HTMLTextAreaElement.prototype.form", "HTMLTextAreaElement", result);
  return result;
}}, "form").get;
registerNativeGetter(form, "form");
