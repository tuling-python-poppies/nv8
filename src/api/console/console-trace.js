import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const trace = {
  trace(...values) {
    appendConsoleRecord("trace", values);
    traceCall("window.console.trace", "console", values, undefined);
  },
}.trace;
registerNativeFunction(trace, "trace");
