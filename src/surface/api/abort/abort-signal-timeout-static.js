import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { abortSignal, createAbortSignal } from "./abort-signal-state.js";

export const timeout = {
  timeout(milliseconds) {
    if (arguments.length === 0) {
      throw new TypeError("AbortSignal.timeout requires 1 argument");
    }
    const number = Number(milliseconds);
    if (!Number.isFinite(number) || number < 0 || number > 0xffffffff) {
      throw new RangeError("The timeout must be an unsigned 32-bit integer");
    }
    const delay = Math.trunc(number);
    const signal = createAbortSignal();
    globalThis.setTimeout(() => {
      abortSignal(
        signal,
        new DOMException(
          `The operation timed out after ${delay} ms`,
          "TimeoutError",
        ),
      );
    }, delay);
    traceCall("window.AbortSignal.timeout", "AbortSignal", [delay], signal);
    return signal;
  },
}.timeout;
registerNativeFunction(timeout, "timeout");
export function installAbortSignalTimeoutStatic() {
  definePrototypeMethod(AbortSignal, "timeout", timeout);
}
