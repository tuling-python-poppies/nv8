import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { validityFlags } from "./validity-state-state.js";
export const customError = Object.getOwnPropertyDescriptor({
  get customError() {
    const result = validityFlags(this).customError;
    traceGetter("window.ValidityState.prototype.customError", "ValidityState", result);
    return result;
  },
}, "customError").get;
registerNativeGetter(customError, "customError");
