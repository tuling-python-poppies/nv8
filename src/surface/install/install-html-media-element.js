import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { addTextTrack } from "../api/media/html-media-element-add-text-track.js";
import { autoplay, setAutoplay } from "../api/media/html-media-element-autoplay-property.js";
import { buffered } from "../api/media/html-media-element-buffered-getter.js";
import { canPlayType } from "../api/media/html-media-element-can-play-type.js";
import { captureStream } from "../api/media/html-media-element-capture-stream.js";
import { controlsList, setControlsList } from "../api/media/html-media-element-controls-list-property.js";
import { controls, setControls } from "../api/media/html-media-element-controls-property.js";
import { crossOrigin, setCrossOrigin } from "../api/media/html-media-element-cross-origin-property.js";
import { currentSrc } from "../api/media/html-media-element-current-src-getter.js";
import { currentTime, setCurrentTime } from "../api/media/html-media-element-current-time-property.js";
import { defaultMuted, setDefaultMuted } from "../api/media/html-media-element-default-muted-property.js";
import { defaultPlaybackRate, setDefaultPlaybackRate } from "../api/media/html-media-element-default-playback-rate-property.js";
import { disableRemotePlayback, setDisableRemotePlayback } from "../api/media/html-media-element-disable-remote-playback-property.js";
import { duration } from "../api/media/html-media-element-duration-getter.js";
import { ended } from "../api/media/html-media-element-ended-getter.js";
import { error } from "../api/media/html-media-element-error-getter.js";
import {
  HTMLMediaElement,
  installHTMLMediaElementConstructor,
} from "../api/media/html-media-element-constructor.js";
import { load } from "../api/media/html-media-element-load.js";
import { loading, setLoading } from "../api/media/html-media-element-loading-property.js";
import { loop, setLoop } from "../api/media/html-media-element-loop-property.js";
import { mediaKeys } from "../api/media/html-media-element-media-keys-getter.js";
import { muted, setMuted } from "../api/media/html-media-element-muted-property.js";
import { networkState } from "../api/media/html-media-element-network-state-getter.js";
import { onencrypted, setOnencrypted } from "../api/media/html-media-element-onencrypted-property.js";
import { onwaitingforkey, setOnwaitingforkey } from "../api/media/html-media-element-onwaitingforkey-property.js";
import { pause } from "../api/media/html-media-element-pause.js";
import { paused } from "../api/media/html-media-element-paused-getter.js";
import { play } from "../api/media/html-media-element-play.js";
import { playbackRate, setPlaybackRate } from "../api/media/html-media-element-playback-rate-property.js";
import { played } from "../api/media/html-media-element-played-getter.js";
import { preload, setPreload } from "../api/media/html-media-element-preload-property.js";
import { preservesPitch, setPreservesPitch } from "../api/media/html-media-element-preserves-pitch-property.js";
import { readyState } from "../api/media/html-media-element-ready-state-getter.js";
import { remote } from "../api/media/html-media-element-remote-getter.js";
import { seekable } from "../api/media/html-media-element-seekable-getter.js";
import { seeking } from "../api/media/html-media-element-seeking-getter.js";
import { setMediaKeys } from "../api/media/html-media-element-set-media-keys.js";
import { setSinkId } from "../api/media/html-media-element-set-sink-id.js";
import { sinkId } from "../api/media/html-media-element-sink-id-getter.js";
import { srcObject, setSrcObject } from "../api/media/html-media-element-src-object-property.js";
import { src, setSrc } from "../api/media/html-media-element-src-property.js";
import { textTracks } from "../api/media/html-media-element-text-tracks-getter.js";
import { volume, setVolume } from "../api/media/html-media-element-volume-property.js";
import { webkitAudioDecodedByteCount } from "../api/media/html-media-element-webkit-audio-decoded-byte-count-getter.js";
import { webkitVideoDecodedByteCount } from "../api/media/html-media-element-webkit-video-decoded-byte-count-getter.js";

export function installHTMLMediaElement() {
  installHTMLMediaElementConstructor();
  getter("error", error);
  accessor("src", src, setSrc);
  getter("currentSrc", currentSrc);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  getter("networkState", networkState);
  accessor("preload", preload, setPreload);
  getter("buffered", buffered);
  getter("readyState", readyState);
  getter("seeking", seeking);
  accessor("currentTime", currentTime, setCurrentTime);
  getter("duration", duration);
  getter("paused", paused);
  accessor("defaultPlaybackRate", defaultPlaybackRate, setDefaultPlaybackRate);
  accessor("playbackRate", playbackRate, setPlaybackRate);
  getter("played", played);
  getter("seekable", seekable);
  getter("ended", ended);
  accessor("autoplay", autoplay, setAutoplay);
  accessor("loop", loop, setLoop);
  accessor("preservesPitch", preservesPitch, setPreservesPitch);
  accessor("controls", controls, setControls);
  accessor("controlsList", controlsList, setControlsList);
  accessor("volume", volume, setVolume);
  accessor("muted", muted, setMuted);
  accessor("defaultMuted", defaultMuted, setDefaultMuted);
  getter("textTracks", textTracks);
  getter("webkitAudioDecodedByteCount", webkitAudioDecodedByteCount);
  getter("webkitVideoDecodedByteCount", webkitVideoDecodedByteCount);
  accessor("onencrypted", onencrypted, setOnencrypted);
  accessor("onwaitingforkey", onwaitingforkey, setOnwaitingforkey);
  accessor("srcObject", srcObject, setSrcObject);
  constant(HTMLMediaElement.prototype, "NETWORK_EMPTY", 0);
  constant(HTMLMediaElement.prototype, "NETWORK_IDLE", 1);
  constant(HTMLMediaElement.prototype, "NETWORK_LOADING", 2);
  constant(HTMLMediaElement.prototype, "NETWORK_NO_SOURCE", 3);
  constant(HTMLMediaElement.prototype, "HAVE_NOTHING", 0);
  constant(HTMLMediaElement.prototype, "HAVE_METADATA", 1);
  constant(HTMLMediaElement.prototype, "HAVE_CURRENT_DATA", 2);
  constant(HTMLMediaElement.prototype, "HAVE_FUTURE_DATA", 3);
  constant(HTMLMediaElement.prototype, "HAVE_ENOUGH_DATA", 4);
  method("addTextTrack", addTextTrack);
  method("canPlayType", canPlayType);
  method("captureStream", captureStream);
  method("load", load);
  method("pause", pause);
  method("play", play);
  accessor("loading", loading, setLoading);
  getter("sinkId", sinkId);
  getter("remote", remote);
  accessor("disableRemotePlayback", disableRemotePlayback, setDisableRemotePlayback);
  method("setSinkId", setSinkId);
  defineConstructorBacklink(HTMLMediaElement.prototype, HTMLMediaElement);
  getter("mediaKeys", mediaKeys);
  method("setMediaKeys", setMediaKeys);
  defineToStringTag(HTMLMediaElement.prototype, "HTMLMediaElement");
  constant(HTMLMediaElement, "NETWORK_EMPTY", 0);
  constant(HTMLMediaElement, "NETWORK_IDLE", 1);
  constant(HTMLMediaElement, "NETWORK_LOADING", 2);
  constant(HTMLMediaElement, "NETWORK_NO_SOURCE", 3);
  constant(HTMLMediaElement, "HAVE_NOTHING", 0);
  constant(HTMLMediaElement, "HAVE_METADATA", 1);
  constant(HTMLMediaElement, "HAVE_CURRENT_DATA", 2);
  constant(HTMLMediaElement, "HAVE_FUTURE_DATA", 3);
  constant(HTMLMediaElement, "HAVE_ENOUGH_DATA", 4);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLMediaElement.prototype, name, callback);
}
function accessor(name, getterCallback, setterCallback) {
  definePrototypeAccessor(
    HTMLMediaElement.prototype,
    name,
    getterCallback,
    setterCallback,
  );
}
function method(name, callback) {
  definePrototypeMethod(HTMLMediaElement.prototype, name, callback);
}
function constant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
