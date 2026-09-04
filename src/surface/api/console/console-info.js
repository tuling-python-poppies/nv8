import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const info = {
  info(...values) {
    appendConsoleRecord("info", values);
    traceCall("window.console.info", "console", values, undefined);
  },
}.info;
registerNativeFunction(info, "info");
