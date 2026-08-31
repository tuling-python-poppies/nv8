import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const validationMessage = Object.getOwnPropertyDescriptor({
  get validationMessage() {
    requireFieldSet(this);
    const result = "";
    traceGetter("window.HTMLFieldSetElement.prototype.validationMessage", "HTMLFieldSetElement", result);
    return result;
  },
}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
