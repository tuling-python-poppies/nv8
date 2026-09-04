import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { componentIndex, requireDOMMatrix } from "./dom-matrix-state.js";

export function matrixComponentGetter(propertyName, owner = "DOMMatrixReadOnly") {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireDOMMatrix(this)[componentIndex[propertyName]];
      traceGetter(`window.${owner}.prototype.${propertyName}`, owner, result);
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}

export function mutableMatrixComponent(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireDOMMatrix(this)[componentIndex[propertyName]];
      traceGetter(`window.DOMMatrix.prototype.${propertyName}`, "DOMMatrix", result);
      return result;
    },
    set [propertyName](value) {
      requireDOMMatrix(this)[componentIndex[propertyName]] = Number(value);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
