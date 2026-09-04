import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireInput } from "./html-input-element-state.js";

export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireInput(this);
    const result = formOwnerOf(this);
    traceGetter("window.HTMLInputElement.prototype.form", "HTMLInputElement", result);
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
