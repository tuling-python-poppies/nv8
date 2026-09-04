import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get startTime() {
    const result = requireTextTrackCue(this).startTime;
    traceGetter("window.TextTrackCue.prototype.startTime", "TextTrackCue", result);
    return result;
  },
  set startTime(value) {
    requireTextTrackCue(this).startTime = Number(value);
  },
}, "startTime");
export const startTime = descriptor.get;
export const setStartTime = descriptor.set;
registerNativeGetter(startTime, "startTime");
registerNativeFunction(setStartTime, "set startTime");
