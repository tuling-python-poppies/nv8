import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { AbortController } from "./abort-controller-constructor.js";
import { requireAbortController } from "./abort-controller-state.js";

export const signal = Object.getOwnPropertyDescriptor({
  get signal() {
    const value = requireAbortController(this).signal;
    traceGetter("window.AbortController.prototype.signal", "AbortController", value);
    return value;
  },
}, "signal").get;
registerNativeGetter(signal, "signal");
export function installAbortControllerSignal() {
  definePrototypeGetter(AbortController.prototype, "signal", signal);
}
