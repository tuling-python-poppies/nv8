import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onenter() {
    const result = requireTextTrackCue(this).onenter;
    traceGetter("window.TextTrackCue.prototype.onenter", "TextTrackCue", result);
    return result;
  },
  set onenter(value) {
    requireTextTrackCue(this).onenter =
      value === null || value === undefined ? null : value;
  },
}, "onenter");
export const onenter = descriptor.get;
export const setOnenter = descriptor.set;
registerNativeGetter(onenter, "onenter");
registerNativeFunction(setOnenter, "set onenter");
