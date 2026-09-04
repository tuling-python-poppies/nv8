import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireRemotePlayback } from "./remote-playback-state.js";
export const watchAvailability = {
  watchAvailability(callback) {
    const state = requireRemotePlayback(this);
    if (typeof callback !== "function") {
      throw new TypeError("The availability callback must be a function");
    }
    state.nextWatchId += 1;
    callback(false);
    const result = Promise.resolve(state.nextWatchId);
    traceCall(
      "window.RemotePlayback.prototype.watchAvailability",
      "RemotePlayback",
      [callback],
      result,
    );
    return result;
  },
}.watchAvailability;
registerNativeFunction(watchAvailability, "watchAvailability");
