import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const log = {
  log(...values) {
    appendConsoleRecord("log", values);
    traceCall("window.console.log", "console", values, undefined);
  },
}.log;
registerNativeFunction(log, "log");
