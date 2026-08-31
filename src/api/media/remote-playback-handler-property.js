import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireRemotePlayback } from "./remote-playback-state.js";
export function remotePlaybackHandlerProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireRemotePlayback(this)[propertyName];
      traceGetter(
        `window.RemotePlayback.prototype.${propertyName}`,
        "RemotePlayback",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireRemotePlayback(this)[propertyName] =
        value === null || value === undefined ? null : value;
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
