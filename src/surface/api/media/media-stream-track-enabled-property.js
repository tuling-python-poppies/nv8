import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get enabled() {
    const result = requireMediaStreamTrack(this).enabled;
    traceGetter("window.MediaStreamTrack.prototype.enabled", "MediaStreamTrack", result);
    return result;
  },
  set enabled(value) {
    requireMediaStreamTrack(this).enabled = Boolean(value);
  },
}, "enabled");
export const enabled = descriptor.get;
export const setEnabled = descriptor.set;
registerNativeGetter(enabled, "enabled");
registerNativeFunction(setEnabled, "set enabled");
