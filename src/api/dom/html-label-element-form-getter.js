import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { formOwnerOf, labelControl } from "./form-association.js";

export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireElement(this);
    const control = labelControl(this);
    const result = control === null ? null : formOwnerOf(control);
    traceGetter(
      "window.HTMLLabelElement.prototype.form",
      "HTMLLabelElement",
      result,
    );
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
