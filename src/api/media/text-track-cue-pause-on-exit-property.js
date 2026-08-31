import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get pauseOnExit() {
    const result = requireTextTrackCue(this).pauseOnExit;
    traceGetter("window.TextTrackCue.prototype.pauseOnExit", "TextTrackCue", result);
    return result;
  },
  set pauseOnExit(value) {
    requireTextTrackCue(this).pauseOnExit = Boolean(value);
  },
}, "pauseOnExit");
export const pauseOnExit = descriptor.get;
export const setPauseOnExit = descriptor.set;
registerNativeGetter(pauseOnExit, "pauseOnExit");
registerNativeFunction(setPauseOnExit, "set pauseOnExit");
