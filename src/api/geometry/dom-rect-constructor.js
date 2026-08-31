import { traceConstruct } from "../../trace/trace-function.js";
import {
  defineGlobalConstructor,
  defineStaticMethod,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { DOMRectReadOnly } from "./dom-rect-read-only-constructor.js";
import { initializeDOMRect, rectFromValue } from "./dom-rect-state.js";

export function DOMRect() {
  if (new.target === undefined) throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  initializeDOMRect(this, arguments[0], arguments[1], arguments[2], arguments[3]);
  traceConstruct("window.DOMRect", [...arguments], "DOMRect");
}
registerNativeFunction(DOMRect, "DOMRect");

export function createDOMRect(x, y, width, height) {
  const rect = Object.create(DOMRect.prototype);
  initializeDOMRect(rect, x, y, width, height);
  return rect;
}

export function installDOMRectConstructor() {
  Object.setPrototypeOf(DOMRect.prototype, DOMRectReadOnly.prototype);
  Object.setPrototypeOf(DOMRect, DOMRectReadOnly);
  delete DOMRect.prototype.constructor;
  defineGlobalConstructor("DOMRect", DOMRect);
  defineStaticMethod(DOMRect, "fromRect", function (other = {}) {
    return createDOMRect(...rectFromValue(other));
  }, 0);
}
