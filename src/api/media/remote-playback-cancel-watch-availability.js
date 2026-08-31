import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireRemotePlayback } from "./remote-playback-state.js";
export const cancelWatchAvailability = {
  cancelWatchAvailability() {
    requireRemotePlayback(this);
    const result = Promise.resolve(undefined);
    traceCall("window.RemotePlayback.prototype.cancelWatchAvailability", "RemotePlayback", [], result);
    return result;
  },
}.cancelWatchAvailability;
registerNativeFunction(cancelWatchAvailability, "cancelWatchAvailability");
