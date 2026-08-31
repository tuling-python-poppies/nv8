import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const form = Object.getOwnPropertyDescriptor({ get form() {
  requireObjectElement(this);
  const result = formOwnerOf(this);
  traceGetter("window.HTMLObjectElement.prototype.form", "HTMLObjectElement", result);
  return result;
}}, "form").get;
registerNativeGetter(form, "form");
