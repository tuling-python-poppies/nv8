import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export function mediaStreamTrackReadonlyGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireMediaStreamTrack(this)[propertyName];
      traceGetter(
        `window.MediaStreamTrack.prototype.${propertyName}`,
        "MediaStreamTrack",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
