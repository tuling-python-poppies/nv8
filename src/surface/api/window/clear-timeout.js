import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { cancelTimer } from "../../../infra/scheduler/timer-state.js";

export const clearTimeout = {
  clearTimeout() {
    const id = arguments[0];
    cancelTimer(id);
    traceCall("window.clearTimeout", "Window", [id], undefined);
  },
}.clearTimeout;

registerNativeFunction(clearTimeout, "clearTimeout");

export function installClearTimeout() {
  defineGlobalFunction("clearTimeout", clearTimeout);
}
