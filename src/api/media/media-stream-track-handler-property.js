import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export function mediaStreamTrackHandlerProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireMediaStreamTrack(this)[propertyName];
      traceGetter(
        `window.MediaStreamTrack.prototype.${propertyName}`,
        "MediaStreamTrack",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireMediaStreamTrack(this)[propertyName] =
        typeof value === "function" ? value : null;
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
