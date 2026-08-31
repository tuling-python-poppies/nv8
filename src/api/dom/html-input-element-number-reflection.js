import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";

export function inputNumberReflection(property, attribute, fallback, minimum, signed = true) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [property]() {
      requireInput(this);
      const parsed = Number.parseInt(this.getAttribute(attribute) ?? "", 10);
      const result = Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
      traceGetter(`window.HTMLInputElement.prototype.${property}`, "HTMLInputElement", result);
      return result;
    },
    set [property](value) {
      requireInput(this);
      const number = signed ? Number(value) >> 0 : Number(value) >>> 0;
      if (number < minimum) {
        throw new DOMException("The value is out of range", "IndexSizeError");
      }
      this.setAttribute(attribute, `${number}`);
    },
  }, property);
  registerNativeGetter(descriptor.get, property);
  registerNativeFunction(descriptor.set, `set ${property}`);
  return descriptor;
}
