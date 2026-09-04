import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const stopPropagation = {
  stopPropagation() {
  requireEvent(this).propagationStopped = true;
  traceCall(
    "window.Event.prototype.stopPropagation",
    "Event",
    [],
    undefined,
  );

  },
}.stopPropagation;

registerNativeFunction(stopPropagation, "stopPropagation");

export function installEventStopPropagation() {
  definePrototypeMethod(Event.prototype, "stopPropagation", stopPropagation);
}
