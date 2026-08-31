import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const patternMismatch = Object.getOwnPropertyDescriptor({
  get patternMismatch() {
    const result = validityFlags(this).patternMismatch;
    traceGetter("window.ValidityState.prototype.patternMismatch", "ValidityState", result);
    return result;
  },
}, "patternMismatch").get;
registerNativeGetter(patternMismatch, "patternMismatch");
