import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const error = {
  error(...values) {
    appendConsoleRecord("error", values);
    traceCall("window.console.error", "console", values, undefined);
  },
}.error;
registerNativeFunction(error, "error");
