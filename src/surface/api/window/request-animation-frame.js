import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { reserveAnimationFrame } from "../../../infra/scheduler/timer-state.js";
import {
  captureScheduledCallbackIncumbent,
  notifyScheduledCallbackIncumbent,
} from "./window-messaging.js";

export const requestAnimationFrame = {
  requestAnimationFrame(callback) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'requestAnimationFrame' on 'Window': 1 argument required, but only 0 present.",
      );
    }
    if (typeof callback !== "function") {
      throw new TypeError(
        "Failed to execute 'requestAnimationFrame' on 'Window': parameter 1 is not of type 'Function'.",
      );
    }
    const incumbentSource = captureScheduledCallbackIncumbent();
    const scheduledHandler = function (...args) {
      notifyScheduledCallbackIncumbent(incumbentSource);
      return Reflect.apply(callback, this, args);
    };
    const id = reserveAnimationFrame(scheduledHandler);
    traceCall("window.requestAnimationFrame", "Window", [callback], id);
    return id;
  },
}.requestAnimationFrame;

registerNativeFunction(requestAnimationFrame, "requestAnimationFrame");

export function installRequestAnimationFrame() {
  defineGlobalFunction("requestAnimationFrame", requestAnimationFrame);
}
