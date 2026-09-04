import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const profile = {
  profile(...values) {
    appendConsoleRecord("profile", values);
    traceCall("window.console.profile", "console", values, undefined);
  },
}.profile;
registerNativeFunction(profile, "profile");
