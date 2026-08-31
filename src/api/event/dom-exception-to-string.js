import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { DOMException } from "./dom-exception-constructor.js";
import { requireDOMException } from "./dom-exception-state.js";

export const toString = {
  toString() {
  const state = requireDOMException(this);
  const result = state.name === ""
    ? state.message
    : state.message === ""
      ? state.name
      : `${state.name}: ${state.message}`;
  traceCall(
    "window.DOMException.prototype.toString",
    "DOMException",
    [],
    result,
  );
  return result;

  },
}.toString;

registerNativeFunction(toString, "toString");

export function installDOMExceptionToString() {
  definePrototypeMethod(DOMException.prototype, "toString", toString);
}
