import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { DOMException } from "./dom-exception-constructor.js";
import { requireDOMException } from "./dom-exception-state.js";

export const domExceptionMessage = {
  domExceptionMessage() {
  const value = requireDOMException(this).message;
  traceGetter("window.DOMException.prototype.message", "DOMException", value);
  return value;

  },
}.domExceptionMessage;

registerNativeGetter(domExceptionMessage, "message");

export function installDOMExceptionMessage() {
  definePrototypeGetter(
    DOMException.prototype,
    "message",
    domExceptionMessage,
  );
}
