import { traceCall } from "../../../infra/trace/trace-function.js";
import { toBoolean } from "../../../engine/webidl/conversions.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireEvent } from "./event-state.js";

export const eventReturnValue = {
  eventReturnValue(value) {
  const state = requireEvent(this);
  const normalized = toBoolean(value);
  if (!normalized && state.cancelable && !state.inPassiveListener) {
    state.defaultPrevented = true;
  }
  traceCall(
    "window.Event.prototype.returnValue",
    "Event",
    [normalized],
    undefined,
  );

  },
}.eventReturnValue;

Object.defineProperty(eventReturnValue, "name", {
  value: "set returnValue",
  configurable: true,
});
registerNativeFunction(eventReturnValue, "set returnValue");
