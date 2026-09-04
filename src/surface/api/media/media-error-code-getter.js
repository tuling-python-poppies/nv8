import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaError } from "./media-error-state.js";
export const code = Object.getOwnPropertyDescriptor({ get code() {
  const result = requireMediaError(this).code;
  traceGetter("window.MediaError.prototype.code", "MediaError", result);
  return result;
}}, "code").get;
registerNativeGetter(code, "code");
