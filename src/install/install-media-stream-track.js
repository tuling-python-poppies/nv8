import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { applyConstraints } from "../api/media/media-stream-track-apply-constraints.js";
import { clone } from "../api/media/media-stream-track-clone.js";
import {
  MediaStreamTrack,
  installMediaStreamTrackConstructor,
} from "../api/media/media-stream-track-constructor.js";
import { contentHint, setContentHint } from "../api/media/media-stream-track-content-hint-property.js";
import { enabled, setEnabled } from "../api/media/media-stream-track-enabled-property.js";
import { getCapabilities } from "../api/media/media-stream-track-get-capabilities.js";
import { getCaptureHandle } from "../api/media/media-stream-track-get-capture-handle.js";
import { getConstraints } from "../api/media/media-stream-track-get-constraints.js";
import { getSettings } from "../api/media/media-stream-track-get-settings.js";
import { id } from "../api/media/media-stream-track-id-getter.js";
import { kind } from "../api/media/media-stream-track-kind-getter.js";
import { label } from "../api/media/media-stream-track-label-getter.js";
import { muted } from "../api/media/media-stream-track-muted-getter.js";
import { oncapturehandlechange, setOncapturehandlechange } from "../api/media/media-stream-track-oncapturehandlechange-property.js";
import { onended, setOnended } from "../api/media/media-stream-track-onended-property.js";
import { onmute, setOnmute } from "../api/media/media-stream-track-onmute-property.js";
import { onunmute, setOnunmute } from "../api/media/media-stream-track-onunmute-property.js";
import { readyState } from "../api/media/media-stream-track-ready-state-getter.js";
import { stats } from "../api/media/media-stream-track-stats-getter.js";
import { stop } from "../api/media/media-stream-track-stop.js";
export function installMediaStreamTrack() {
  installMediaStreamTrackConstructor();
  getter("kind", kind);
  getter("id", id);
  getter("label", label);
  accessor("enabled", enabled, setEnabled);
  getter("muted", muted);
  accessor("onmute", onmute, setOnmute);
  accessor("onunmute", onunmute, setOnunmute);
  getter("readyState", readyState);
  accessor("onended", onended, setOnended);
  getter("stats", stats);
  accessor("contentHint", contentHint, setContentHint);
  method("applyConstraints", applyConstraints);
  method("clone", clone);
  method("getCapabilities", getCapabilities);
  method("getConstraints", getConstraints);
  method("getSettings", getSettings);
  method("stop", stop);
  accessor("oncapturehandlechange", oncapturehandlechange, setOncapturehandlechange);
  method("getCaptureHandle", getCaptureHandle);
  defineConstructorBacklink(MediaStreamTrack.prototype, MediaStreamTrack);
  defineToStringTag(MediaStreamTrack.prototype, "MediaStreamTrack");
}
function getter(name, callback) {
  definePrototypeGetter(MediaStreamTrack.prototype, name, callback);
}
function accessor(name, getterCallback, setterCallback) {
  definePrototypeAccessor(MediaStreamTrack.prototype, name, getterCallback, setterCallback);
}
function method(name, callback) {
  definePrototypeMethod(MediaStreamTrack.prototype, name, callback);
}
