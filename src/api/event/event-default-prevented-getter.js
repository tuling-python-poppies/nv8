import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventDefaultPrevented = {
  eventDefaultPrevented() {
  const value = requireEvent(this).defaultPrevented;
  traceGetter("window.Event.prototype.defaultPrevented", "Event", value);
  return value;

  },
}.eventDefaultPrevented;

registerNativeGetter(eventDefaultPrevented, "defaultPrevented");

export function installEventDefaultPrevented() {
  definePrototypeGetter(
    Event.prototype,
    "defaultPrevented",
    eventDefaultPrevented,
  );
}
