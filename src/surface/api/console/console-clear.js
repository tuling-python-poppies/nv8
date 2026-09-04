import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { clearConsoleRecords } from "./console-state.js";

export const clear = {
  clear() {
    clearConsoleRecords();
    traceCall("window.console.clear", "console", [], undefined);
  },
}.clear;
registerNativeFunction(clear, "clear");
