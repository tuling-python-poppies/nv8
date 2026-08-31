import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { MutationObserver } from "./mutation-observer-constructor.js";
import { observeTarget } from "./mutation-observer-state.js";

export const observe = {
  observe(target) {
    const options = arguments[1];
    observeTarget(this, target, options);
    traceCall(
      "window.MutationObserver.prototype.observe",
      "MutationObserver",
      [target, options],
      undefined,
    );
  },
}.observe;
registerNativeFunction(observe, "observe");
export function installMutationObserverObserve() {
  definePrototypeMethod(MutationObserver.prototype, "observe", observe);
}
