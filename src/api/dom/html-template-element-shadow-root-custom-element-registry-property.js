import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get shadowRootCustomElementRegistry() {
    const result = requireTemplate(this).shadowRootCustomElementRegistry;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootCustomElementRegistry", "HTMLTemplateElement", result);
    return result;
  },
  set shadowRootCustomElementRegistry(value) {
    requireTemplate(this).shadowRootCustomElementRegistry =
      value !== null && (typeof value === "object" || typeof value === "function")
        ? value
        : null;
  },
}, "shadowRootCustomElementRegistry");
export const shadowRootCustomElementRegistry = descriptor.get;
export const setShadowRootCustomElementRegistry = descriptor.set;
registerNativeGetter(shadowRootCustomElementRegistry, "shadowRootCustomElementRegistry");
registerNativeFunction(setShadowRootCustomElementRegistry, "set shadowRootCustomElementRegistry");
