import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrackList } from "./text-track-list-state.js";
export function textTrackListHandlerProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireTextTrackList(this)[propertyName];
      traceGetter(
        `window.TextTrackList.prototype.${propertyName}`,
        "TextTrackList",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireTextTrackList(this)[propertyName] =
        value === null || value === undefined ? null : value;
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}
