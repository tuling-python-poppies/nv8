import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const tooLong = Object.getOwnPropertyDescriptor({
  get tooLong() {
    const result = validityFlags(this).tooLong;
    traceGetter("window.ValidityState.prototype.tooLong", "ValidityState", result);
    return result;
  },
}, "tooLong").get;
registerNativeGetter(tooLong, "tooLong");
