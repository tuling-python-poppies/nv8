import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

const eventComposed = {
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
