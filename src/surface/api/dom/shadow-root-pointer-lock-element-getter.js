import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const pointerLockElement = Object.getOwnPropertyDescriptor({
  get pointerLockElement() {
    requireShadowRoot(this);
    const result = null;
    traceGetter(
      "window.ShadowRoot.prototype.pointerLockElement",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "pointerLockElement").get;
registerNativeGetter(pointerLockElement, "pointerLockElement");
