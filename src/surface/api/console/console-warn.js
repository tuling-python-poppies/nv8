import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const warn = {
  warn(...values) {
    appendConsoleRecord("warn", values);
    traceCall("window.console.warn", "console", values, undefined);
  },
}.warn;
registerNativeFunction(warn, "warn");
