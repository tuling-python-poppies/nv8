import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import {
  abortSignal,
  createAbortSignal,
  requireAbortSignal,
} from "./abort-signal-state.js";

export const any = {
  any(signals) {
    if (arguments.length === 0) {
      throw new TypeError("AbortSignal.any requires 1 argument");
    }
    const sources = Array.from(signals);
    const result = createAbortSignal();
    for (const source of sources) {
      const state = requireAbortSignal(source);
      if (state.aborted) {
        abortSignal(result, state.reason);
        break;
      }
      source.addEventListener("abort", () => {
        abortSignal(result, requireAbortSignal(source).reason);
      }, { once: true });
    }
    traceCall("window.AbortSignal.any", "AbortSignal", [signals], result);
    return result;
  },
}.any;
registerNativeFunction(any, "any");
export function installAbortSignalAnyStatic() {
  definePrototypeMethod(AbortSignal, "any", any);
}
