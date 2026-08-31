import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cancelTimer } from "../../scheduler/timer-state.js";

export const cancelAnimationFrame = {
  cancelAnimationFrame(handle) {
    cancelTimer(handle);
    traceCall("window.cancelAnimationFrame", "Window", [handle], undefined);
  },
}.cancelAnimationFrame;

registerNativeFunction(cancelAnimationFrame, "cancelAnimationFrame");

export function installCancelAnimationFrame() {
  defineGlobalFunction("cancelAnimationFrame", cancelAnimationFrame);
}
