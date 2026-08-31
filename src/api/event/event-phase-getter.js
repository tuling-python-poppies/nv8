import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventPhase = {
  eventPhase() {
  const value = requireEvent(this).eventPhase;
  traceGetter("window.Event.prototype.eventPhase", "Event", value);
  return value;

  },
}.eventPhase;

registerNativeGetter(eventPhase, "eventPhase");

export function installEventPhase() {
  definePrototypeGetter(Event.prototype, "eventPhase", eventPhase);
}
