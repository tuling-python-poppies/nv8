import { initializeEventTarget } from "../event/event-target-state.js";
import { createTextTrackCueList } from "./text-track-cue-list-state.js";
import { TextTrack } from "./text-track-constructor.js";

const textTrackState = new WeakMap();

export function createTextTrack(kind, label, language, id = "") {
  const track = Object.create(TextTrack.prototype);
  initializeEventTarget(track);
  textTrackState.set(track, {
    kind,
    label,
    language,
    id,
    mode: "disabled",
    cues: createTextTrackCueList(),
    activeCues: createTextTrackCueList(),
    oncuechange: null,
  });
  return track;
}

export function requireTextTrack(track) {
  const state = textTrackState.get(track);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
