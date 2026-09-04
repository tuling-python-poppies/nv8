import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const stepMismatch = Object.getOwnPropertyDescriptor({
  get stepMismatch() {
    const result = validityFlags(this).stepMismatch;
    traceGetter("window.ValidityState.prototype.stepMismatch", "ValidityState", result);
    return result;
  },
}, "stepMismatch").get;
registerNativeGetter(stepMismatch, "stepMismatch");
