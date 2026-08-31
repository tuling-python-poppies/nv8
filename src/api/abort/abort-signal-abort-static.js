import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { createAbortSignal } from "./abort-signal-state.js";

export const abort = {
  abort(reason = undefined) {
    const normalized = arguments.length === 0
      ? new DOMException("This operation was aborted", "AbortError")
      : reason;
    const value = createAbortSignal(normalized, true);
    traceCall("window.AbortSignal.abort", "AbortSignal", Array.from(arguments), value);
    return value;
  },
}.abort;
registerNativeFunction(abort, "abort");
export function installAbortSignalAbortStatic() {
  definePrototypeMethod(AbortSignal, "abort", abort);
}
