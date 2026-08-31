import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get snapToLines() {
    const result = requireVTTCue(this).snapToLines;
    traceGetter("window.VTTCue.prototype.snapToLines", "VTTCue", result);
    return result;
  },
  set snapToLines(value) {
    requireVTTCue(this).snapToLines = Boolean(value);
  },
}, "snapToLines");
export const snapToLines = descriptor.get;
export const setSnapToLines = descriptor.set;
registerNativeGetter(snapToLines, "snapToLines");
registerNativeFunction(setSnapToLines, "set snapToLines");
