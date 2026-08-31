import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
import { formOwnerOf } from "./form-association.js";
export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireSelect(this);
    const result = formOwnerOf(this);
    traceGetter("window.HTMLSelectElement.prototype.form", "HTMLSelectElement", result);
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
