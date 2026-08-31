import { traceCall } from "../../trace/trace-function.js";
import { toBoolean, toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const initEvent = {
  initEvent(type) {
  const state = requireEvent(this);
  if (state.dispatching) {
    return;
  }
  state.type = toDOMString(type);
  state.bubbles = arguments.length > 1 ? toBoolean(arguments[1]) : false;
  state.cancelable = arguments.length > 2 ? toBoolean(arguments[2]) : false;
  state.defaultPrevented = false;
  traceCall(
    "window.Event.prototype.initEvent",
    "Event",
    [type, arguments[1], arguments[2]],
    undefined,
  );

  },
}.initEvent;

registerNativeFunction(initEvent, "initEvent");

export function installEventInitEvent() {
  definePrototypeMethod(Event.prototype, "initEvent", initEvent);
}
