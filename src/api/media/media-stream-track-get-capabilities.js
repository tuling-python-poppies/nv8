import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const getCapabilities = {
  getCapabilities() {
    const state = requireMediaStreamTrack(this);
    const result = state.kind === "audio"
      ? {
          autoGainControl: [],
          deviceId: [],
          echoCancellation: [],
          noiseSuppression: [],
          voiceIsolation: [],
        }
      : {
          deviceId: [],
          facingMode: [],
          resizeMode: ["none", "crop-and-scale"],
        };
    traceCall("window.MediaStreamTrack.prototype.getCapabilities", "MediaStreamTrack", [], result);
    return result;
  },
}.getCapabilities;
registerNativeFunction(getCapabilities, "getCapabilities");
