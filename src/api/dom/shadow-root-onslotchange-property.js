import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get onslotchange() {
    const result = requireShadowRoot(this).onslotchange;
    traceGetter(
      "window.ShadowRoot.prototype.onslotchange",
      "ShadowRoot",
      result,
    );
    return result;
  },
  set onslotchange(value) {
    const state = requireShadowRoot(this);
    if (state.onslotchange !== null) {
      this.removeEventListener("slotchange", state.onslotchange);
    }
    state.onslotchange = typeof value === "function" ? value : null;
    if (state.onslotchange !== null) {
      this.addEventListener("slotchange", state.onslotchange);
    }
  },
}, "onslotchange");

export const onslotchange = descriptor.get;
export const setOnslotchange = descriptor.set;
registerNativeGetter(onslotchange, "onslotchange");
registerNativeFunction(setOnslotchange, "set onslotchange");
