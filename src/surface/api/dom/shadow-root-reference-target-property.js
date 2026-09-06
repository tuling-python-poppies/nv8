import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get referenceTarget() {
    const value = requireShadowRoot(this).referenceTarget;
    traceGetter("window.ShadowRoot.prototype.referenceTarget", "ShadowRoot", value);
    return value;
  },
  set referenceTarget(value) {
    requireShadowRoot(this).referenceTarget = value === null ? null : `${value}`;
  },
}, "referenceTarget");
export const referenceTarget = descriptor.get;
export const setReferenceTarget = descriptor.set;
registerNativeGetter(referenceTarget, "referenceTarget");
registerNativeFunction(setReferenceTarget, "set referenceTarget");
