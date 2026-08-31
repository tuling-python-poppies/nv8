import { createMediaStreamTrack } from "../media/media-stream-track-state.js";
import {
  CanvasCaptureMediaStreamTrack,
} from "./canvas-capture-media-stream-track-constructor.js";

const captureTrackState = new WeakMap();

export function createCanvasCaptureMediaStreamTrack(canvas) {
  const track = createMediaStreamTrack("video", "CanvasCaptureMediaStreamTrack");
  Object.setPrototypeOf(track, CanvasCaptureMediaStreamTrack.prototype);
  captureTrackState.set(track, { canvas, requestedFrames: 0 });
  return track;
}

export function requireCanvasCaptureMediaStreamTrack(track) {
  const state = captureTrackState.get(track);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
