import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const validAlignments = new Set(["start", "center", "end", "left", "right"]);
const descriptor = Object.getOwnPropertyDescriptor({
  get align() {
    const result = requireVTTCue(this).align;
    traceGetter("window.VTTCue.prototype.align", "VTTCue", result);
    return result;
  },
  set align(value) {
    const normalized = `${value}`;
    if (!validAlignments.has(normalized)) {
      throw new TypeError("Invalid VTTCue align value");
    }
    requireVTTCue(this).align = normalized;
  },
}, "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;
registerNativeGetter(align, "align");
registerNativeFunction(setAlign, "set align");
