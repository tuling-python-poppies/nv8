import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  appendConsoleRecord,
  consoleTimerRead,
} from "./console-state.js";

export const timeEnd = {
  timeEnd(label = "default") {
    const normalized = `${label}`;
    const elapsed = consoleTimerRead(normalized, true);
    if (elapsed !== null) {
      appendConsoleRecord("timeEnd", [`${normalized}: ${elapsed}ms`]);
    }
    traceCall("window.console.timeEnd", "console", [normalized], undefined);
  },
}.timeEnd;
registerNativeFunction(timeEnd, "timeEnd");
