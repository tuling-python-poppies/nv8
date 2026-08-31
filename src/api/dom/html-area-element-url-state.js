import { getAttributeValue, requireElement, setAttributeValue } from "./element-state.js";
import { ownerURL } from "./html-reflection.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";

export function areaURL(area) {
  requireElement(area);
  const raw = getAttributeValue(area, "href");
  if (raw === null) return null;
  try {
    return new URL(raw, ownerURL(area));
  } catch {
    return null;
  }
}

export function areaURLComponentProperty(property, readOnly = false) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [property]() {
      const url = areaURL(this);
      const result = url === null
        ? (property === "protocol" ? ":" : "")
        : url[property];
      traceGetter(`window.HTMLAreaElement.prototype.${property}`, "HTMLAreaElement", result);
      return result;
    },
    set [property](value) {
      requireElement(this);
      const url = areaURL(this) ?? new URL(ownerURL(this));
      url[property] = `${value}`;
      setAttributeValue(this, "href", url.href);
    },
  }, property);
  registerNativeGetter(descriptor.get, property);
  registerNativeFunction(descriptor.set, `set ${property}`);
  return readOnly ? { get: descriptor.get, set: undefined } : descriptor;
}
