import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

const eventCancelable = {
  eventCancelable() {
  const value = requireEvent(this).cancelable;
  traceGetter("window.Event.prototype.cancelable", "Event", value);
  return value;

  },
}.eventCancelable;

registerNativeGetter(eventCancelable, "cancelable");

export function installEventCancelable() {
  definePrototypeGetter(Event.prototype, "cancelable", eventCancelable);
}
