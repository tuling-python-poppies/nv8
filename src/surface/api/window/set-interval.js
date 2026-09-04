import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { reserveTimer } from "../../../infra/scheduler/timer-state.js";

export const setInterval = {
  setInterval(handler) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'setInterval' on 'Window': 1 argument required, but only 0 present.",
      );
    }
    const delay = arguments.length > 1 ? arguments[1] : 0;
    const callbackArguments = Array.prototype.slice.call(arguments, 2);
    const id = reserveTimer(handler, delay, callbackArguments, true);
    traceCall("window.setInterval", "Window", [handler, delay], id);
    return id;
  },
}.setInterval;

registerNativeFunction(setInterval, "setInterval");

export function installSetInterval() {
  defineGlobalFunction("setInterval", setInterval);
}
