import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const debug = {
  debug(...values) {
    appendConsoleRecord("debug", values);
    traceCall("window.console.debug", "console", values, undefined);
  },
}.debug;
registerNativeFunction(debug, "debug");
