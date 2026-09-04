import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const timeStamp = {
  timeStamp(...values) {
    appendConsoleRecord("timeStamp", values);
    traceCall("window.console.timeStamp", "console", values, undefined);
  },
}.timeStamp;
registerNativeFunction(timeStamp, "timeStamp");
