import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get shadowRootDelegatesFocus() {
    const result = requireTemplate(this).shadowRootDelegatesFocus;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootDelegatesFocus", "HTMLTemplateElement", result);
    return result;
  },
  set shadowRootDelegatesFocus(value) {
    requireTemplate(this).shadowRootDelegatesFocus = Boolean(value);
  },
}, "shadowRootDelegatesFocus");
export const shadowRootDelegatesFocus = descriptor.get;
export const setShadowRootDelegatesFocus = descriptor.set;
registerNativeGetter(shadowRootDelegatesFocus, "shadowRootDelegatesFocus");
registerNativeFunction(setShadowRootDelegatesFocus, "set shadowRootDelegatesFocus");
