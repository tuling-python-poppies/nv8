import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { reserveAnimationFrame } from "../../scheduler/timer-state.js";

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
    const id = reserveAnimationFrame(callback);
    traceCall("window.requestAnimationFrame", "Window", [callback], id);
    return id;
  },
}.requestAnimationFrame;

registerNativeFunction(requestAnimationFrame, "requestAnimationFrame");

export function installRequestAnimationFrame() {
  defineGlobalFunction("requestAnimationFrame", requestAnimationFrame);
}
