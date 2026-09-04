import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireFrameSetElement } from "./html-frame-set-element-state.js";

export function frameSetHandlerProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result =
        requireFrameSetElement(this).handlers.get(propertyName) ?? null;
      traceGetter(
        `window.HTMLFrameSetElement.prototype.${propertyName}`,
        "HTMLFrameSetElement",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      const handlers = requireFrameSetElement(this).handlers;
      if (value === null || value === undefined) handlers.delete(propertyName);
      else handlers.set(propertyName, value);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
