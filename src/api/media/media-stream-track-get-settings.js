import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const getSettings = {
  getSettings() {
    const state = requireMediaStreamTrack(this);
    const result = state.kind === "audio"
      ? { deviceId: state.id, sampleSize: 16 }
      : { deviceId: state.id, resizeMode: "none" };
    traceCall("window.MediaStreamTrack.prototype.getSettings", "MediaStreamTrack", [], result);
    return result;
  },
}.getSettings;
registerNativeFunction(getSettings, "getSettings");
