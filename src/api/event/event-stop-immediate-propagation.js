import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const stopImmediatePropagation = {
  stopImmediatePropagation() {
  const state = requireEvent(this);
  state.propagationStopped = true;
  state.immediatePropagationStopped = true;
  traceCall(
    "window.Event.prototype.stopImmediatePropagation",
    "Event",
    [],
    undefined,
  );

  },
}.stopImmediatePropagation;

registerNativeFunction(stopImmediatePropagation, "stopImmediatePropagation");

export function installEventStopImmediatePropagation() {
  definePrototypeMethod(
    Event.prototype,
    "stopImmediatePropagation",
    stopImmediatePropagation,
  );
}
