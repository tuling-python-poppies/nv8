import { traceConstruct } from "../../trace/trace-function.js";
import {
  defineGlobalConstructor,
  defineStaticMethod,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeDOMRect, rectFromValue } from "./dom-rect-state.js";

export function DOMRectReadOnly() {
  if (new.target === undefined) throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  initializeDOMRect(this, arguments[0], arguments[1], arguments[2], arguments[3]);
  traceConstruct("window.DOMRectReadOnly", [...arguments], "DOMRectReadOnly");
}
registerNativeFunction(DOMRectReadOnly, "DOMRectReadOnly");

export function createDOMRectReadOnly(x, y, width, height) {
  const rect = Object.create(DOMRectReadOnly.prototype);
  initializeDOMRect(rect, x, y, width, height);
  return rect;
}

export function installDOMRectReadOnlyConstructor() {
  delete DOMRectReadOnly.prototype.constructor;
  defineGlobalConstructor("DOMRectReadOnly", DOMRectReadOnly);
  defineStaticMethod(DOMRectReadOnly, "fromRect", function (other = {}) {
    return createDOMRectReadOnly(...rectFromValue(other));
  }, 0);
}
