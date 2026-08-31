import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireVideoElement } from "./html-video-element-state.js";

export function videoReadonlyProperty(propertyName) {
  let getter;
  getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireVideoElement(this, getter)[propertyName];
      traceGetter(
        `window.HTMLVideoElement.prototype.${propertyName}`,
        "HTMLVideoElement",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}

export function videoProperty(propertyName, normalize = value => value) {
  let getter;
  let setter;
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireVideoElement(this, getter)[propertyName];
      traceGetter(
        `window.HTMLVideoElement.prototype.${propertyName}`,
        "HTMLVideoElement",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireVideoElement(this, setter)[propertyName] = normalize(value);
    },
  }, propertyName);
  getter = descriptor.get;
  setter = descriptor.set;
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function videoHandlerProperty(propertyName) {
  return videoProperty(
    propertyName,
    value => typeof value === "function" ? value : null,
  );
}
