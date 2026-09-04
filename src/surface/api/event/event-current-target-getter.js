import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
