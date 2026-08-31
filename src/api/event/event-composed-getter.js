import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventComposed = {
  eventComposed() {
  const value = requireEvent(this).composed;
  traceGetter("window.Event.prototype.composed", "Event", value);
  return value;

  },
}.eventComposed;

registerNativeGetter(eventComposed, "composed");

export function installEventComposed() {
  definePrototypeGetter(Event.prototype, "composed", eventComposed);
}
