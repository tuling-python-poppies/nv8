import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireRemotePlayback } from "./remote-playback-state.js";
export const state = Object.getOwnPropertyDescriptor({ get state() {
  requireRemotePlayback(this);
  const result = "disconnected";
  traceGetter("window.RemotePlayback.prototype.state", "RemotePlayback", result);
  return result;
}}, "state").get;
registerNativeGetter(state, "state");
