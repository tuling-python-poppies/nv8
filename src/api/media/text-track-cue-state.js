import { initializeEventTarget } from "../event/event-target-state.js";

const cueState = new WeakMap();

export function initializeTextTrackCue(cue, startTime, endTime) {
  initializeEventTarget(cue);
  cueState.set(cue, {
    track: null,
    id: "",
    startTime,
    endTime,
    pauseOnExit: false,
    onenter: null,
    onexit: null,
  });
}

export function requireTextTrackCue(cue) {
  const state = cueState.get(cue);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isTextTrackCue(cue) {
  return cueState.has(cue);
}

export function setTextTrackCueTrack(cue, track) {
  requireTextTrackCue(cue).track = track;
}
