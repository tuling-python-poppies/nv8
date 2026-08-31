import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get endTime() {
    const result = requireTextTrackCue(this).endTime;
    traceGetter("window.TextTrackCue.prototype.endTime", "TextTrackCue", result);
    return result;
  },
  set endTime(value) {
    requireTextTrackCue(this).endTime = Number(value);
  },
}, "endTime");
export const endTime = descriptor.get;
export const setEndTime = descriptor.set;
registerNativeGetter(endTime, "endTime");
registerNativeFunction(setEndTime, "set endTime");
