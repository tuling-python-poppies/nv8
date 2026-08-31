import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const table = {
  table(...values) {
    appendConsoleRecord("table", values);
    traceCall("window.console.table", "console", values, undefined);
  },
}.table;
registerNativeFunction(table, "table");
