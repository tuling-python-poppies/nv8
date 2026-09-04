import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { consoleTimerStart } from "./console-state.js";

export const time = {
  time(label = "default") {
    const normalized = `${label}`;
    consoleTimerStart(normalized);
    traceCall("window.console.time", "console", [normalized], undefined);
  },
}.time;
registerNativeFunction(time, "time");
