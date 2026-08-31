import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get shadowRootClonable() {
    const result = requireTemplate(this).shadowRootClonable;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootClonable", "HTMLTemplateElement", result);
    return result;
  },
  set shadowRootClonable(value) {
    requireTemplate(this).shadowRootClonable = Boolean(value);
  },
}, "shadowRootClonable");
export const shadowRootClonable = descriptor.get;
export const setShadowRootClonable = descriptor.set;
registerNativeGetter(shadowRootClonable, "shadowRootClonable");
registerNativeFunction(setShadowRootClonable, "set shadowRootClonable");
