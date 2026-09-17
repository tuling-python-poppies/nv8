import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

const eventBubbles = {
  eventBubbles() {
  const value = requireEvent(this).bubbles;
  traceGetter("window.Event.prototype.bubbles", "Event", value);
  return value;

  },
}.eventBubbles;

registerNativeGetter(eventBubbles, "bubbles");

export function installEventBubbles() {
  definePrototypeGetter(Event.prototype, "bubbles", eventBubbles);
}
