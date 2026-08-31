import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { requireAbortSignal } from "./abort-signal-state.js";

export const throwIfAborted = {
  throwIfAborted() {
    const state = requireAbortSignal(this);
    traceCall(
      "window.AbortSignal.prototype.throwIfAborted",
      "AbortSignal",
      [],
      undefined,
    );
    if (state.aborted) {
      throw state.reason;
    }
  },
}.throwIfAborted;
registerNativeFunction(throwIfAborted, "throwIfAborted");
export function installAbortSignalThrowIfAborted() {
  definePrototypeMethod(AbortSignal.prototype, "throwIfAborted", throwIfAborted);
}
