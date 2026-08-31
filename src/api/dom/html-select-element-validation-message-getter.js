import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireSelect, selectValidityFlags } from "./html-select-element-state.js";
export const validationMessage = Object.getOwnPropertyDescriptor({
  get validationMessage() {
    const state = requireSelect(this);
    const flags = selectValidityFlags(this);
    const result = state.customValidity !== ""
      ? state.customValidity
      : flags.valueMissing
        ? "Please select an item in the list."
        : "";
    traceGetter("window.HTMLSelectElement.prototype.validationMessage", "HTMLSelectElement", result);
    return result;
  },
}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
