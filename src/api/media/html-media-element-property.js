import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";

export function mediaReadonlyProperty(propertyName, select = state => state[propertyName]) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = select(requireMediaElement(this), this);
      traceGetter(
        `window.HTMLMediaElement.prototype.${propertyName}`,
        "HTMLMediaElement",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}

export function mediaProperty(
  propertyName,
  normalize = value => value,
  change = (state, value) => {
    state[propertyName] = value;
  },
) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireMediaElement(this)[propertyName];
      traceGetter(
        `window.HTMLMediaElement.prototype.${propertyName}`,
        "HTMLMediaElement",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      const state = requireMediaElement(this);
      change(state, normalize(value), this);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function mediaHandlerProperty(propertyName) {
  return mediaProperty(
    propertyName,
    value => value === null || value === undefined ? null : value,
  );
}
