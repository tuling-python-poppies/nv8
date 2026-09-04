import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventSrcElement = {
  eventSrcElement() {
  const value = requireEvent(this).target;
  traceGetter("window.Event.prototype.srcElement", "Event", value);
  return value;

  },
}.eventSrcElement;

registerNativeGetter(eventSrcElement, "srcElement");

export function installEventSrcElement() {
  definePrototypeGetter(Event.prototype, "srcElement", eventSrcElement);
}
