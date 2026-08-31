import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { appendConsoleRecord } from "./console-state.js";

export const assert = {
  assert(condition, ...values) {
    if (!condition) {
      appendConsoleRecord("assert", values);
    }
    traceCall(
      "window.console.assert",
      "console",
      [condition, ...values],
      undefined,
    );
  },
}.assert;
Object.defineProperty(assert, "length", {
  value: 0,
  configurable: true,
});
registerNativeFunction(assert, "assert");
