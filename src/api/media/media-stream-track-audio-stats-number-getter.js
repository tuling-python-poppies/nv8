import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaStreamTrackAudioStats } from "./media-stream-track-audio-stats-state.js";
export function audioStatsNumberGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireMediaStreamTrackAudioStats(this)[propertyName];
      traceGetter(
        `window.MediaStreamTrackAudioStats.prototype.${propertyName}`,
        "MediaStreamTrackAudioStats",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
