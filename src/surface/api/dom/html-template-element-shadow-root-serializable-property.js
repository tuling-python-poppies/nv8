import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get shadowRootSerializable() {
    const result = requireTemplate(this).shadowRootSerializable;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootSerializable", "HTMLTemplateElement", result);
    return result;
  },
  set shadowRootSerializable(value) {
    requireTemplate(this).shadowRootSerializable = Boolean(value);
  },
}, "shadowRootSerializable");
export const shadowRootSerializable = descriptor.get;
export const setShadowRootSerializable = descriptor.set;
registerNativeGetter(shadowRootSerializable, "shadowRootSerializable");
registerNativeFunction(setShadowRootSerializable, "set shadowRootSerializable");
