import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { mediaStreamIsActive } from "./media-stream-state.js";
export const active = Object.getOwnPropertyDescriptor({ get active() {
  const result = mediaStreamIsActive(this);
  traceGetter("window.MediaStream.prototype.active", "MediaStream", result);
  return result;
}}, "active").get;
registerNativeGetter(active, "active");
