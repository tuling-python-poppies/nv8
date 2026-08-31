import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { clearConsoleRecords } from "./console-state.js";

export const clear = {
  clear() {
    clearConsoleRecords();
    traceCall("window.console.clear", "console", [], undefined);
  },
}.clear;
registerNativeFunction(clear, "clear");
