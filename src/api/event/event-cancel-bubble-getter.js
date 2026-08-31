import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireEvent } from "./event-state.js";

export const eventCancelBubble = {
  eventCancelBubble() {
  const value = requireEvent(this).propagationStopped;
  traceGetter("window.Event.prototype.cancelBubble", "Event", value);
  return value;

  },
}.eventCancelBubble;

registerNativeGetter(eventCancelBubble, "cancelBubble");
