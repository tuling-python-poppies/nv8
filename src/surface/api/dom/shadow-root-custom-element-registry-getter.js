import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const customElementRegistry = Object.getOwnPropertyDescriptor({
  get customElementRegistry() {
    requireShadowRoot(this);
    const result = null;
    traceGetter(
      "window.ShadowRoot.prototype.customElementRegistry",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "customElementRegistry").get;
registerNativeGetter(customElementRegistry, "customElementRegistry");
