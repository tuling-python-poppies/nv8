import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  appendConsoleRecord,
  consoleGroupStart,
} from "./console-state.js";

export const group = {
  group(...values) {
    appendConsoleRecord("group", values);
    consoleGroupStart();
    traceCall("window.console.group", "console", values, undefined);
  },
}.group;
registerNativeFunction(group, "group");
