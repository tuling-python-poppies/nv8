import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const preventDefault = {
  preventDefault() {
  const state = requireEvent(this);
  if (state.cancelable && !state.inPassiveListener) {
    state.defaultPrevented = true;
  }
  traceCall(
    "window.Event.prototype.preventDefault",
    "Event",
    [],
    undefined,
  );

  },
}.preventDefault;

registerNativeFunction(preventDefault, "preventDefault");

export function installEventPreventDefault() {
  definePrototypeMethod(Event.prototype, "preventDefault", preventDefault);
}
