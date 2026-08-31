import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireForm } from "./html-form-element-state.js";

export const elements = Object.getOwnPropertyDescriptor({
  get elements() {
    const result = requireForm(this).elements;
    traceGetter("window.HTMLFormElement.prototype.elements", "HTMLFormElement", result);
    return result;
  },
}, "elements").get;
registerNativeGetter(elements, "elements");
