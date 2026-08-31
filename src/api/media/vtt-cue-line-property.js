import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get line() {
    const result = requireVTTCue(this).line;
    traceGetter("window.VTTCue.prototype.line", "VTTCue", result);
    return result;
  },
  set line(value) {
    requireVTTCue(this).line =
      typeof value === "string" && value === "auto" ? "auto" : Number(value);
  },
}, "line");
export const line = descriptor.get;
export const setLine = descriptor.set;
registerNativeGetter(line, "line");
registerNativeFunction(setLine, "set line");
