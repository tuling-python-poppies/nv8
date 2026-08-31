import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireFieldSet } from "./html-field-set-element-state.js";

export const elements = Object.getOwnPropertyDescriptor({
  get elements() {
    const result = requireFieldSet(this).elements;
    traceGetter("window.HTMLFieldSetElement.prototype.elements", "HTMLFieldSetElement", result);
    return result;
  },
}, "elements").get;
registerNativeGetter(elements, "elements");
