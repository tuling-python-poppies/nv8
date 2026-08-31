import { createTextTrack } from "../media/text-track-state.js";

export const TRACK_NONE = 0;
export const TRACK_LOADING = 1;
export const TRACK_LOADED = 2;
export const TRACK_ERROR = 3;

const trackElementState = new WeakMap();

export function initializeTrackElement(element) {
  trackElementState.set(element, {
    readyState: TRACK_NONE,
    track: createTextTrack("subtitles", "", "", ""),
  });
}

export function requireTrackElement(element) {
  const state = trackElementState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
