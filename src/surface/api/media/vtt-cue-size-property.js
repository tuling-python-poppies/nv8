import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get size() {
    const result = requireVTTCue(this).size;
    traceGetter("window.VTTCue.prototype.size", "VTTCue", result);
    return result;
  },
  set size(value) {
    const normalized = Number(value);
    if (!(normalized >= 0 && normalized <= 100)) {
      throw new TypeError("VTTCue size must be between 0 and 100");
    }
    requireVTTCue(this).size = normalized;
  },
}, "size");
export const size = descriptor.get;
export const setSize = descriptor.set;
registerNativeGetter(size, "size");
registerNativeFunction(setSize, "set size");
