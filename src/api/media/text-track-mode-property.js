import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
const validModes = new Set(["disabled", "hidden", "showing"]);
const descriptor = Object.getOwnPropertyDescriptor({
  get mode() {
    const result = requireTextTrack(this).mode;
    traceGetter("window.TextTrack.prototype.mode", "TextTrack", result);
    return result;
  },
  set mode(value) {
    const normalized = `${value}`;
    if (!validModes.has(normalized)) {
      throw new TypeError("Invalid TextTrack mode");
    }
    requireTextTrack(this).mode = normalized;
  },
}, "mode");
export const mode = descriptor.get;
export const setMode = descriptor.set;
registerNativeGetter(mode, "mode");
registerNativeFunction(setMode, "set mode");
