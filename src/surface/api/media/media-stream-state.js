import { initializeEventTarget } from "../event/event-target-state.js";
import {
  cloneMediaStreamTrack,
  isMediaStreamTrack,
  requireMediaStreamTrack,
} from "./media-stream-track-state.js";
import { MediaStream } from "./media-stream-constructor.js";
const state = new WeakMap();
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const mediaStreamSlot = createRealmSlot(() => ({
  nextId: 0,
}), "mediaStream");

function mediaStreamRealmState() {
  return mediaStreamSlot.get(globalThis);
}
export function normalizeMediaStreamTracks(value = []) {
  if (isMediaStream(value)) return [...requireMediaStream(value).tracks];
  if (value === null || value === undefined || typeof value[Symbol.iterator] !== "function") {
    throw new TypeError("Failed to convert value to a sequence");
  }
  const tracks = [...value];
  if (!tracks.every(isMediaStreamTrack)) {
    throw new TypeError("Failed to convert value to 'MediaStreamTrack'.");
  }
  return tracks;
}
export function initializeMediaStream(stream, tracks = []) {
  initializeEventTarget(stream);
  mediaStreamRealmState().nextId += 1;
  state.set(stream, {
    id: `${mediaStreamRealmState().nextId.toString(16).padStart(8, "0")}-0000-4000-8000-${mediaStreamRealmState().nextId.toString(16).padStart(12, "0")}`,
    tracks: [...tracks],
    onaddtrack: null,
    onremovetrack: null,
    onactive: null,
    oninactive: null,
  });
}
export function createMediaStream(tracks = []) {
  const stream = Object.create(MediaStream.prototype);
  initializeMediaStream(stream, normalizeMediaStreamTracks(tracks));
  return stream;
}
export function requireMediaStream(stream) {
  const value = state.get(stream);
  if (value === undefined) throw new TypeError("Illegal invocation");
  return value;
}
export function isMediaStream(stream) {
  return state.has(stream);
}
export function cloneMediaStream(stream) {
  return createMediaStream(
    requireMediaStream(stream).tracks.map(cloneMediaStreamTrack),
  );
}
export function mediaStreamIsActive(stream) {
  return requireMediaStream(stream).tracks.some(
    track => requireMediaStreamTrack(track).readyState === "live",
  );
}
