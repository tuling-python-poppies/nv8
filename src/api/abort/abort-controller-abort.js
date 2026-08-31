import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { AbortController } from "./abort-controller-constructor.js";
import { requireAbortController } from "./abort-controller-state.js";
import { abortSignal } from "./abort-signal-state.js";

export const abort = {
  abort(reason = undefined) {
    const signal = requireAbortController(this).signal;
    const normalized = arguments.length === 0
      ? new DOMException("This operation was aborted", "AbortError")
      : reason;
    abortSignal(signal, normalized);
    traceCall(
      "window.AbortController.prototype.abort",
      "AbortController",
      Array.from(arguments),
      undefined,
    );
  },
}.abort;
registerNativeFunction(abort, "abort");
export function installAbortControllerAbort() {
  definePrototypeMethod(AbortController.prototype, "abort", abort);
}
