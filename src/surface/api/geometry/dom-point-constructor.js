import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { DOMPointReadOnly } from "./dom-point-read-only-constructor.js";
import { initializeDOMPoint } from "./dom-point-state.js";

export function DOMPoint(x = 0, y = 0, z = 0, w = 1) {
  if (new.target === undefined) {
    throw new TypeError("DOMPoint must be constructed with new");
  }
  initializeDOMPoint(this, x, y, z, w);
  traceConstruct("window.DOMPoint", [...arguments], "DOMPoint");
}
registerNativeFunction(DOMPoint, "DOMPoint");

export function createDOMPoint(x = 0, y = 0, z = 0, w = 1) {
  const point = Object.create(DOMPoint.prototype);
  initializeDOMPoint(point, x, y, z, w);
  return point;
}

export function installDOMPointConstructor() {
  Object.setPrototypeOf(DOMPoint.prototype, DOMPointReadOnly.prototype);
  Object.setPrototypeOf(DOMPoint, DOMPointReadOnly);
  delete DOMPoint.prototype.constructor;
  defineGlobalConstructor("DOMPoint", DOMPoint);
}
