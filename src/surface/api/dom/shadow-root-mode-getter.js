import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const mode = Object.getOwnPropertyDescriptor({
  get mode() {
    const result = requireShadowRoot(this).mode;
    traceGetter("window.ShadowRoot.prototype.mode", "ShadowRoot", result);
    return result;
  },
}, "mode").get;
registerNativeGetter(mode, "mode");
