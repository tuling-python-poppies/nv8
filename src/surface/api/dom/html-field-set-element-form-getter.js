import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireFieldSet(this);
    const result = formOwnerOf(this);
    traceGetter("window.HTMLFieldSetElement.prototype.form", "HTMLFieldSetElement", result);
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
