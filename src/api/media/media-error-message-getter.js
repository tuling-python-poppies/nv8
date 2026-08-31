import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaError } from "./media-error-state.js";
export const message = Object.getOwnPropertyDescriptor({ get message() {
  const result = requireMediaError(this).message;
  traceGetter("window.MediaError.prototype.message", "MediaError", result);
  return result;
}}, "message").get;
registerNativeGetter(message, "message");
