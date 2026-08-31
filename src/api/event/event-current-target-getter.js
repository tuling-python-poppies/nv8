import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventCurrentTarget = {
  eventCurrentTarget() {
  const value = requireEvent(this).currentTarget;
  traceGetter("window.Event.prototype.currentTarget", "Event", value);
  return value;

  },
}.eventCurrentTarget;

registerNativeGetter(eventCurrentTarget, "currentTarget");

export function installEventCurrentTarget() {
  definePrototypeGetter(Event.prototype, "currentTarget", eventCurrentTarget);
}
