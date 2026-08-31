import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const host = Object.getOwnPropertyDescriptor({
  get host() {
    const result = requireShadowRoot(this).host;
    traceGetter("window.ShadowRoot.prototype.host", "ShadowRoot", result);
    return result;
  },
}, "host").get;
registerNativeGetter(host, "host");
