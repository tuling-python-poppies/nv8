import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireEvent } from "./event-state.js";

export const eventReturnValue = {
  eventReturnValue() {
  const value = !requireEvent(this).defaultPrevented;
  traceGetter("window.Event.prototype.returnValue", "Event", value);
  return value;

  },
}.eventReturnValue;

registerNativeGetter(eventReturnValue, "returnValue");
