import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeDOMPoint } from "./dom-point-state.js";

export function DOMPointReadOnly(x = 0, y = 0, z = 0, w = 1) {
  if (new.target === undefined) {
    throw new TypeError("DOMPointReadOnly must be constructed with new");
  }
  initializeDOMPoint(this, x, y, z, w);
  traceConstruct("window.DOMPointReadOnly", [...arguments], "DOMPointReadOnly");
}
registerNativeFunction(DOMPointReadOnly, "DOMPointReadOnly");

export function installDOMPointReadOnlyConstructor() {
  delete DOMPointReadOnly.prototype.constructor;
  defineGlobalConstructor("DOMPointReadOnly", DOMPointReadOnly);
}
