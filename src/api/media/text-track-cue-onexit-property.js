import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onexit() {
    const result = requireTextTrackCue(this).onexit;
    traceGetter("window.TextTrackCue.prototype.onexit", "TextTrackCue", result);
    return result;
  },
  set onexit(value) {
    requireTextTrackCue(this).onexit =
      value === null || value === undefined ? null : value;
  },
}, "onexit");
export const onexit = descriptor.get;
export const setOnexit = descriptor.set;
registerNativeGetter(onexit, "onexit");
registerNativeFunction(setOnexit, "set onexit");
