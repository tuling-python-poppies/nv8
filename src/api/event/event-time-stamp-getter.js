import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventTimeStamp = {
  eventTimeStamp() {
  const value = requireEvent(this).timeStamp;
  traceGetter("window.Event.prototype.timeStamp", "Event", value);
  return value;

  },
}.eventTimeStamp;

registerNativeGetter(eventTimeStamp, "timeStamp");

export function installEventTimeStamp() {
  definePrototypeGetter(Event.prototype, "timeStamp", eventTimeStamp);
}
