import { initializeEventTarget } from "../event/event-target-state.js";
import { createMediaStreamTrackAudioStats } from "./media-stream-track-audio-stats-state.js";
import { MediaStreamTrack } from "./media-stream-track-constructor.js";
const state = new WeakMap();
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const mediaTrackSlot = createRealmSlot(() => ({
  nextId: 0,
}), "mediaTrack");

function mediaTrackRealmState() {
  return mediaTrackSlot.get(globalThis);
}
export function createMediaStreamTrack(kind, label = undefined) {
  const track = Object.create(MediaStreamTrack.prototype);
  initializeMediaStreamTrack(track, kind, label);
  return track;
}
export function initializeMediaStreamTrack(track, kind, label = undefined) {
  if (kind !== "audio" && kind !== "video") {
    throw new TypeError("Invalid track kind");
  }
  initializeEventTarget(track);
  mediaTrackRealmState().nextId += 1;
  const id = `${mediaTrackRealmState().nextId.toString(16).padStart(8, "0")}-0000-4000-8000-${mediaTrackRealmState().nextId.toString(16).padStart(12, "0")}`;
  state.set(track, {
    kind,
    id,
    label: label === undefined ? id : `${label}`,
    enabled: true,
    muted: false,
    readyState: "live",
    onmute: null,
    onunmute: null,
    onended: null,
    stats: kind === "audio" ? createMediaStreamTrackAudioStats() : null,
    contentHint: "",
    oncapturehandlechange: null,
  });
}
export function requireMediaStreamTrack(track) {
  const value = state.get(track);
  if (value === undefined) throw new TypeError("Illegal invocation");
  return value;
}
export function isMediaStreamTrack(track) {
  return state.has(track);
}
export function cloneMediaStreamTrack(track) {
  const source = requireMediaStreamTrack(track);
  const clone = createMediaStreamTrack(source.kind, source.label);
  const target = requireMediaStreamTrack(clone);
  target.enabled = source.enabled;
  target.muted = source.muted;
  target.readyState = source.readyState;
  target.contentHint = source.contentHint;
  return clone;
}
