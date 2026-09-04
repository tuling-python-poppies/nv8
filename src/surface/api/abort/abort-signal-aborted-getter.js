import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { requireAbortSignal } from "./abort-signal-state.js";

export const aborted = Object.getOwnPropertyDescriptor({
  get aborted() {
    const value = requireAbortSignal(this).aborted;
    traceGetter("window.AbortSignal.prototype.aborted", "AbortSignal", value);
    return value;
  },
}, "aborted").get;
registerNativeGetter(aborted, "aborted");
export function installAbortSignalAborted() {
  definePrototypeGetter(AbortSignal.prototype, "aborted", aborted);
}
