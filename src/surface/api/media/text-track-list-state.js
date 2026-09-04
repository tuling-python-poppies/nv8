import { initializeEventTarget } from "../event/event-target-state.js";
import { TextTrackList } from "./text-track-list-constructor.js";

const textTrackListState = new WeakMap();

export function createTextTrackList() {
  const list = Object.create(TextTrackList.prototype);
  initializeEventTarget(list);
  textTrackListState.set(list, {
    tracks: [],
    indexedLength: 0,
    onchange: null,
    onaddtrack: null,
    onremovetrack: null,
  });
  return list;
}

export function requireTextTrackList(list) {
  const state = textTrackListState.get(list);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function appendTextTrack(list, track) {
  const state = requireTextTrackList(list);
  state.tracks.push(track);
  const index = state.tracks.length - 1;
  Object.defineProperty(list, index, {
    value: track,
    writable: false,
    enumerable: true,
    configurable: true,
  });
  state.indexedLength = state.tracks.length;
  return true;
}
