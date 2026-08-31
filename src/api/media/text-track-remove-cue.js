import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  removeTextTrackCue,
} from "./text-track-cue-list-state.js";
import { isTextTrackCue, setTextTrackCueTrack } from "./text-track-cue-state.js";
import { requireTextTrack } from "./text-track-state.js";
export const removeCue = {
  removeCue(cue) {
    const state = requireTextTrack(this);
    if (!isTextTrackCue(cue)) {
      throw new TypeError("removeCue requires a TextTrackCue");
    }
    if (!removeTextTrackCue(state.cues, cue)) {
      throw new TypeError("The cue is not part of this track");
    }
    removeTextTrackCue(state.activeCues, cue);
    setTextTrackCueTrack(cue, null);
    traceCall("window.TextTrack.prototype.removeCue", "TextTrack", [cue], undefined);
  },
}.removeCue;
registerNativeFunction(removeCue, "removeCue");
