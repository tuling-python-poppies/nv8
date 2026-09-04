import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cancelTimer } from "../../../infra/scheduler/timer-state.js";

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
