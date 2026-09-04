import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  appendConsoleRecord,
  consoleTimerRead,
} from "./console-state.js";

export const timeLog = {
  timeLog(label = "default", ...values) {
    const normalized = `${label}`;
    const elapsed = consoleTimerRead(normalized, false);
    if (elapsed !== null) {
      appendConsoleRecord("timeLog", [
        `${normalized}: ${elapsed}ms`,
        ...values,
      ]);
    }
    traceCall(
      "window.console.timeLog",
      "console",
      [normalized, ...values],
      undefined,
    );
  },
}.timeLog;
registerNativeFunction(timeLog, "timeLog");
