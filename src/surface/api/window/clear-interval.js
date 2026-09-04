import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cancelTimer } from "../../../infra/scheduler/timer-state.js";

export const clearInterval = {
  clearInterval() {
    const id = arguments[0];
    cancelTimer(id);
    traceCall("window.clearInterval", "Window", [id], undefined);
  },
}.clearInterval;

registerNativeFunction(clearInterval, "clearInterval");

export function installClearInterval() {
  defineGlobalFunction("clearInterval", clearInterval);
}
