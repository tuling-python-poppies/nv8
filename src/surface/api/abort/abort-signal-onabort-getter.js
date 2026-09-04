import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireAbortSignal } from "./abort-signal-state.js";

export const onabort = Object.getOwnPropertyDescriptor({
  get onabort() {
    const value = requireAbortSignal(this).onabort;
    traceGetter("window.AbortSignal.prototype.onabort", "AbortSignal", value);
    return value;
  },
}, "onabort").get;
registerNativeGetter(onabort, "onabort");
