import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  appendConsoleRecord,
  consoleGroupStart,
} from "./console-state.js";

export const groupCollapsed = {
  groupCollapsed(...values) {
    appendConsoleRecord("groupCollapsed", values);
    consoleGroupStart();
    traceCall("window.console.groupCollapsed", "console", values, undefined);
  },
}.groupCollapsed;
registerNativeFunction(groupCollapsed, "groupCollapsed");
