import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireAbortSignal } from "./abort-signal-state.js";

export const onabort = Object.getOwnPropertyDescriptor({
  set onabort(value) {
    requireAbortSignal(this).onabort = typeof value === "function" ? value : null;
    traceCall("window.AbortSignal.prototype.onabort", "AbortSignal", [value], undefined);
  },
}, "onabort").set;
registerNativeFunction(onabort, "set onabort");
