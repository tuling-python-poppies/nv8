import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";

export function textAreaNumberReflection(property, attribute, fallback, positive) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [property]() {
      requireTextArea(this);
      const parsed = Number.parseInt(this.getAttribute(attribute) ?? "", 10);
      const result = Number.isFinite(parsed) && (!positive || parsed > 0)
        ? parsed
        : fallback;
      traceGetter(`window.HTMLTextAreaElement.prototype.${property}`, "HTMLTextAreaElement", result);
      return result;
    },
    set [property](value) {
      requireTextArea(this);
      const normalized = Number(value) >> 0;
      if ((positive && normalized <= 0) || (!positive && normalized < 0)) {
        throw new DOMException("The value is out of range", "IndexSizeError");
      }
      this.setAttribute(attribute, `${normalized}`);
    },
  }, property);
  registerNativeGetter(descriptor.get, property);
  registerNativeFunction(descriptor.set, `set ${property}`);
  return descriptor;
}
