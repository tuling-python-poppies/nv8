import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFrameElement } from "./html-frame-element-state.js";

export function frameStringProperty(propertyName, attributeName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireFrameElement(this);
      const result = this.getAttribute(attributeName) ?? "";
      traceGetter(
        `window.HTMLFrameElement.prototype.${propertyName}`,
        "HTMLFrameElement",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireFrameElement(this);
      this.setAttribute(attributeName, `${value}`);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
