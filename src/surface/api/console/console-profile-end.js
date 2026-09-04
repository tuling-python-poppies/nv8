import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const profileEnd = {
  profileEnd(...values) {
    appendConsoleRecord("profileEnd", values);
    traceCall("window.console.profileEnd", "console", values, undefined);
  },
}.profileEnd;
registerNativeFunction(profileEnd, "profileEnd");
