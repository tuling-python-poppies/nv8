import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  appendConsoleRecord,
  consoleCount,
} from "./console-state.js";

export const count = {
  count(label = "default") {
    const normalized = `${label}`;
    const value = consoleCount(normalized);
    appendConsoleRecord("count", [`${normalized}: ${value}`]);
    traceCall("window.console.count", "console", [normalized], undefined);
  },
}.count;
registerNativeFunction(count, "count");
