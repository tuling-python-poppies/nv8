import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventType = {
  eventType() {
  const value = requireEvent(this).type;
  traceGetter("window.Event.prototype.type", "Event", value);
  return value;

  },
}.eventType;

registerNativeGetter(eventType, "type");

export function installEventType() {
  definePrototypeGetter(Event.prototype, "type", eventType);
}
