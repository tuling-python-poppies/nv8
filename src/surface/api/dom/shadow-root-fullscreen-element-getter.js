import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const fullscreenElement = Object.getOwnPropertyDescriptor({
  get fullscreenElement() {
    requireShadowRoot(this);
    const result = null;
    traceGetter(
      "window.ShadowRoot.prototype.fullscreenElement",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "fullscreenElement").get;
registerNativeGetter(fullscreenElement, "fullscreenElement");
