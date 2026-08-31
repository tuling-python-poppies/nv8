import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const dirxml = {
  dirxml(...values) {
    appendConsoleRecord("dirxml", values);
    traceCall("window.console.dirxml", "console", values, undefined);
  },
}.dirxml;
registerNativeFunction(dirxml, "dirxml");
