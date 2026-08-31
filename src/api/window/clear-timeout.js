import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cancelTimer } from "../../scheduler/timer-state.js";

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
