import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const type = Object.getOwnPropertyDescriptor({
  get type() {
    requireFieldSet(this);
    const result = "fieldset";
    traceGetter("window.HTMLFieldSetElement.prototype.type", "HTMLFieldSetElement", result);
    return result;
  },
}, "type").get;
registerNativeGetter(type, "type");
