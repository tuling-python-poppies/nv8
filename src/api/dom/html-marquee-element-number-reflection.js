import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireMarquee } from "./html-marquee-element-state.js";
export function marqueeNumberReflection(property, attribute, fallback, signed = false) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [property]() {
      requireMarquee(this);
      const parsed = Number.parseInt(this.getAttribute(attribute) ?? "", 10);
      const result = Number.isFinite(parsed) ? (signed ? parsed >> 0 : parsed >>> 0) : fallback;
      traceGetter(`window.HTMLMarqueeElement.prototype.${property}`, "HTMLMarqueeElement", result);
      return result;
    },
    set [property](value) {
      requireMarquee(this);
      this.setAttribute(attribute, `${signed ? Number(value) >> 0 : Number(value) >>> 0}`);
    },
  }, property);
  registerNativeGetter(descriptor.get, property);
  registerNativeFunction(descriptor.set, `set ${property}`);
  return descriptor;
}
