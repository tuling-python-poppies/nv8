import { createDOMTokenList } from "../dom/dom-token-list-state.js";
import { createRemotePlayback } from "./remote-playback-state.js";
import { createTextTrackList } from "./text-track-list-state.js";

const mediaState = new WeakMap();

export function initializeMediaElement(element, source = "") {
  mediaState.set(element, {
    src: `${source}`,
    currentSrc: "",
    crossOrigin: null,
    networkState: 0,
    preload: "metadata",
    readyState: 0,
    seeking: false,
    currentTime: 0,
    duration: Number.NaN,
    paused: true,
    defaultPlaybackRate: 1,
    playbackRate: 1,
    hasPlayed: false,
    ended: false,
    autoplay: false,
    loop: false,
    preservesPitch: true,
    controls: false,
    controlsList: createDOMTokenList(element, "controlslist"),
    volume: 1,
    muted: false,
    defaultMuted: false,
    textTracks: createTextTrackList(),
    onencrypted: null,
    onwaitingforkey: null,
    srcObject: null,
    loading: "eager",
    sinkId: "",
    remote: createRemotePlayback(),
    disableRemotePlayback: false,
    mediaKeys: null,
  });
}

export function requireMediaElement(element) {
  const state = mediaState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isMediaElement(element) {
  return mediaState.has(element);
}

export function resetMediaElement(element) {
  const state = requireMediaElement(element);
  state.currentSrc = "";
  state.networkState = 0;
  state.readyState = 0;
  state.seeking = false;
  state.currentTime = 0;
  state.duration = Number.NaN;
  state.paused = true;
  state.ended = false;
  state.hasPlayed = false;
}
