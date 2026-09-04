import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get position() {
    const result = requireVTTCue(this).position;
    traceGetter("window.VTTCue.prototype.position", "VTTCue", result);
    return result;
  },
  set position(value) {
    const normalized = Number(value);
    if (!(normalized >= 0 && normalized <= 100)) {
      throw new TypeError("VTTCue position must be between 0 and 100");
    }
    requireVTTCue(this).position = normalized;
  },
}, "position");
export const position = descriptor.get;
export const setPosition = descriptor.set;
registerNativeGetter(position, "position");
registerNativeFunction(setPosition, "set position");
