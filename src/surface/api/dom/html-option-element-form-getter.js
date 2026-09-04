import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { formOwnerOf } from "./form-association.js";
export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireElement(this);
    const select = this.closest("select");
    const result = select === null ? null : formOwnerOf(select);
    traceGetter("window.HTMLOptionElement.prototype.form", "HTMLOptionElement", result);
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
