import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { reserveTimer } from "../../../infra/scheduler/timer-state.js";
import {
  captureScheduledCallbackIncumbent,
  notifyScheduledCallbackIncumbent,
} from "./window-messaging.js";

export const setInterval = {
  setInterval(handler) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'setInterval' on 'Window': 1 argument required, but only 0 present.",
      );
    }
    const delay = arguments.length > 1 ? arguments[1] : 0;
    const callbackArguments = Array.prototype.slice.call(arguments, 2);
    const incumbentSource = captureScheduledCallbackIncumbent();
    const scheduledHandler = function (...args) {
      notifyScheduledCallbackIncumbent(incumbentSource);
      return Reflect.apply(handler, this, args);
    };
    const id = reserveTimer(scheduledHandler, delay, callbackArguments, true);
    traceCall("window.setInterval", "Window", [handler, delay], id);
    return id;
  },
}.setInterval;

registerNativeFunction(setInterval, "setInterval");

export function installSetInterval() {
  defineGlobalFunction("setInterval", setInterval);
}
