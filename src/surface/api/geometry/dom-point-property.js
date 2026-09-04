import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireDOMPoint } from "./dom-point-state.js";

export function pointGetter(propertyName, owner = "DOMPointReadOnly") {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireDOMPoint(this)[propertyName];
      traceGetter(`window.${owner}.prototype.${propertyName}`, owner, result);
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}

export function mutablePointProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireDOMPoint(this)[propertyName];
      traceGetter(`window.DOMPoint.prototype.${propertyName}`, "DOMPoint", result);
      return result;
    },
    set [propertyName](value) {
      requireDOMPoint(this)[propertyName] = Number(value);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
