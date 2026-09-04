import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";

export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireElement(this);
    const fieldset = this.closest("fieldset");
    let result = fieldset?.closest("form") ?? null;
    if (result === null && fieldset !== null) {
      const formId = fieldset.getAttribute("form");
      if (formId !== null && formId !== "") {
        const candidate = this.ownerDocument?.getElementById(formId) ?? null;
        result = candidate?.localName === "form" ? candidate : null;
      }
    }
    traceGetter(
      "window.HTMLLegendElement.prototype.form",
      "HTMLLegendElement",
      result,
    );
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
