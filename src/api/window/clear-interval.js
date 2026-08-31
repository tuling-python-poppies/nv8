import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cancelTimer } from "../../scheduler/timer-state.js";

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
