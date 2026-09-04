import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaStream } from "./media-stream-state.js";
export function mediaStreamHandlerProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireMediaStream(this)[propertyName];
      traceGetter(`window.MediaStream.prototype.${propertyName}`, "MediaStream", result);
      return result;
    },
    set [propertyName](value) {
      requireMediaStream(this)[propertyName] =
        typeof value === "function" ? value : null;
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
