import { traceCall } from "../../../infra/trace/trace-function.js";
import { toBoolean } from "../../../engine/webidl/conversions.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireEvent } from "./event-state.js";

export const eventCancelBubble = {
  eventCancelBubble(value) {
  const state = requireEvent(this);
  const normalized = toBoolean(value);
  if (normalized) {
    state.propagationStopped = true;
  }
  traceCall(
    "window.Event.prototype.cancelBubble",
    "Event",
    [normalized],
    undefined,
  );

  },
}.eventCancelBubble;

Object.defineProperty(eventCancelBubble, "name", {
  value: "set cancelBubble",
  configurable: true,
});
registerNativeFunction(eventCancelBubble, "set cancelBubble");
