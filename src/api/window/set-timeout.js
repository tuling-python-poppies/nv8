import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { reserveTimer } from "../../scheduler/timer-state.js";

export const setTimeout = {
  setTimeout(handler) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'setTimeout' on 'Window': 1 argument required, but only 0 present.",
      );
    }
    const delay = arguments.length > 1 ? arguments[1] : 0;
    const callbackArguments = Array.prototype.slice.call(arguments, 2);
    const id = reserveTimer(handler, delay, callbackArguments, false);
    traceCall("window.setTimeout", "Window", [handler, delay], id);
    return id;
  },
}.setTimeout;

registerNativeFunction(setTimeout, "setTimeout");

export function installSetTimeout() {
  defineGlobalFunction("setTimeout", setTimeout);
}
