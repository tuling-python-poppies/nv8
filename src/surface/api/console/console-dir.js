import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const dir = {
  dir(...values) {
    appendConsoleRecord("dir", values);
    traceCall("window.console.dir", "console", values, undefined);
  },
}.dir;
registerNativeFunction(dir, "dir");
