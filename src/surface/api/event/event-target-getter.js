import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const eventTarget = {
  eventTarget() {
  const value = requireEvent(this).target;
  traceGetter("window.Event.prototype.target", "Event", value);
  return value;

  },
}.eventTarget;

registerNativeGetter(eventTarget, "target");

export function installEventTargetGetter() {
  definePrototypeGetter(Event.prototype, "target", eventTarget);
}
