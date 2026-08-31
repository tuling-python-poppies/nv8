import { traceCall } from "../../trace/trace-function.js";
import { toBoolean, toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CustomEvent } from "./custom-event-constructor.js";
import { requireCustomEvent } from "./custom-event-state.js";
import { requireEvent } from "./event-state.js";

export const initCustomEvent = {
  initCustomEvent(type) {
  const eventState = requireEvent(this);
  const customState = requireCustomEvent(this);
  if (eventState.dispatching) {
    return;
  }
  eventState.type = toDOMString(type);
  eventState.bubbles = arguments.length > 1 ? toBoolean(arguments[1]) : false;
  eventState.cancelable = arguments.length > 2 ? toBoolean(arguments[2]) : false;
  eventState.defaultPrevented = false;
  customState.detail = arguments.length > 3 ? arguments[3] : null;
  traceCall(
    "window.CustomEvent.prototype.initCustomEvent",
    "CustomEvent",
    [type, arguments[1], arguments[2], arguments[3]],
    undefined,
  );

  },
}.initCustomEvent;

registerNativeFunction(initCustomEvent, "initCustomEvent");

export function installCustomEventInitCustomEvent() {
  definePrototypeMethod(
    CustomEvent.prototype,
    "initCustomEvent",
    initCustomEvent,
  );
}
