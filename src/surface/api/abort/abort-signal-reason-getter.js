import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { requireAbortSignal } from "./abort-signal-state.js";

export const reason = Object.getOwnPropertyDescriptor({
  get reason() {
    const value = requireAbortSignal(this).reason;
    traceGetter("window.AbortSignal.prototype.reason", "AbortSignal", value);
    return value;
  },
}, "reason").get;
registerNativeGetter(reason, "reason");
export function installAbortSignalReason() {
  definePrototypeGetter(AbortSignal.prototype, "reason", reason);
}
