import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get vertical() {
    const result = requireVTTCue(this).vertical;
    traceGetter("window.VTTCue.prototype.vertical", "VTTCue", result);
    return result;
  },
  set vertical(value) {
    const normalized = `${value}`;
    if (normalized !== "" && normalized !== "rl" && normalized !== "lr") {
      throw new TypeError("Invalid VTTCue vertical value");
    }
    requireVTTCue(this).vertical = normalized;
  },
}, "vertical");
export const vertical = descriptor.get;
export const setVertical = descriptor.set;
registerNativeGetter(vertical, "vertical");
registerNativeFunction(setVertical, "set vertical");
