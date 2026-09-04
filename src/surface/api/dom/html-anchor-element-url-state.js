import { getAttributeValue, setAttributeValue } from "./element-state.js";
import { ownerURL } from "./html-reflection.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";

export function anchorURL(anchor) {
  const raw = getAttributeValue(anchor, "href");
  if (raw === null) {
    return null;
  }
  try {
    return new URL(raw, ownerURL(anchor));
  } catch {
    return null;
  }
}

export function setAnchorURLComponent(anchor, component, value) {
  const url = anchorURL(anchor) ?? new URL(ownerURL(anchor));
  url[component] = `${value}`;
  setAttributeValue(anchor, "href", url.href);
}

export function anchorURLComponentProperty(propertyName, readOnly = false) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const url = anchorURL(this);
      const result = url === null
        ? (propertyName === "protocol" ? ":" : "")
        : url[propertyName];
      traceGetter(
        `window.HTMLAnchorElement.prototype.${propertyName}`,
        "HTMLAnchorElement",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      setAnchorURLComponent(this, propertyName, value);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return readOnly
    ? { get: descriptor.get, set: undefined }
    : descriptor;
}
