import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireVideoPlaybackQuality } from "./video-playback-quality-state.js";

export function qualityNumberGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireVideoPlaybackQuality(this)[propertyName];
      traceGetter(
        `window.VideoPlaybackQuality.prototype.${propertyName}`,
        "VideoPlaybackQuality",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
