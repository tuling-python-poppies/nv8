import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { consoleCountReset } from "./console-state.js";

export const countReset = {
  countReset(label = "default") {
    const normalized = `${label}`;
    consoleCountReset(normalized);
    traceCall("window.console.countReset", "console", [normalized], undefined);
  },
}.countReset;
registerNativeFunction(countReset, "countReset");
