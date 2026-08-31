import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  appendTextTrackCue,
} from "./text-track-cue-list-state.js";
import {
  isTextTrackCue,
  setTextTrackCueTrack,
} from "./text-track-cue-state.js";
import { requireTextTrack } from "./text-track-state.js";
export const addCue = {
  addCue(cue) {
    const state = requireTextTrack(this);
    if (!isTextTrackCue(cue)) {
      throw new TypeError("addCue requires a TextTrackCue");
    }
    appendTextTrackCue(state.cues, cue);
    setTextTrackCueTrack(cue, this);
    if (state.mode !== "disabled") appendTextTrackCue(state.activeCues, cue);
    traceCall("window.TextTrack.prototype.addCue", "TextTrack", [cue], undefined);
  },
}.addCue;
registerNativeFunction(addCue, "addCue");
