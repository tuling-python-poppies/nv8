import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { consoleGroupEnd } from "./console-state.js";

export const groupEnd = {
  groupEnd() {
    consoleGroupEnd();
    traceCall("window.console.groupEnd", "console", [], undefined);
  },
}.groupEnd;
registerNativeFunction(groupEnd, "groupEnd");
