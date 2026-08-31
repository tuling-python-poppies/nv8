import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrackCue } from "./text-track-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get id() {
    const result = requireTextTrackCue(this).id;
    traceGetter("window.TextTrackCue.prototype.id", "TextTrackCue", result);
    return result;
  },
  set id(value) {
    requireTextTrackCue(this).id = `${value}`;
  },
}, "id");
export const id = descriptor.get;
export const setId = descriptor.set;
registerNativeGetter(id, "id");
registerNativeFunction(setId, "set id");
