import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get shadowRootMode() {
    const result = requireTemplate(this).shadowRootMode;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootMode", "HTMLTemplateElement", result);
    return result;
  },
  set shadowRootMode(value) {
    requireTemplate(this).shadowRootMode = `${value}`;
  },
}, "shadowRootMode");
export const shadowRootMode = descriptor.get;
export const setShadowRootMode = descriptor.set;
registerNativeGetter(shadowRootMode, "shadowRootMode");
registerNativeFunction(setShadowRootMode, "set shadowRootMode");
