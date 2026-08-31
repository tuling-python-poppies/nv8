import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { active } from "../api/media/media-stream-active-getter.js";
import { addTrack } from "../api/media/media-stream-add-track.js";
import { clone } from "../api/media/media-stream-clone.js";
import {
  MediaStream,
  installMediaStreamConstructor,
} from "../api/media/media-stream-constructor.js";
import { getAudioTracks } from "../api/media/media-stream-get-audio-tracks.js";
import { getTrackById } from "../api/media/media-stream-get-track-by-id.js";
import { getTracks } from "../api/media/media-stream-get-tracks.js";
import { getVideoTracks } from "../api/media/media-stream-get-video-tracks.js";
import { id } from "../api/media/media-stream-id-getter.js";
import { onactive, setOnactive } from "../api/media/media-stream-onactive-property.js";
import { onaddtrack, setOnaddtrack } from "../api/media/media-stream-onaddtrack-property.js";
import { oninactive, setOninactive } from "../api/media/media-stream-oninactive-property.js";
import { onremovetrack, setOnremovetrack } from "../api/media/media-stream-onremovetrack-property.js";
import { removeTrack } from "../api/media/media-stream-remove-track.js";
export function installMediaStream() {
  installMediaStreamConstructor();
  getter("id", id);
  getter("active", active);
  accessor("onaddtrack", onaddtrack, setOnaddtrack);
  accessor("onremovetrack", onremovetrack, setOnremovetrack);
  accessor("onactive", onactive, setOnactive);
  accessor("oninactive", oninactive, setOninactive);
  method("addTrack", addTrack);
  method("clone", clone);
  method("getAudioTracks", getAudioTracks);
  method("getTrackById", getTrackById);
  method("getTracks", getTracks);
  method("getVideoTracks", getVideoTracks);
  method("removeTrack", removeTrack);
  defineConstructorBacklink(MediaStream.prototype, MediaStream);
  defineToStringTag(MediaStream.prototype, "MediaStream");
}
function getter(name, callback) {
  definePrototypeGetter(MediaStream.prototype, name, callback);
}
function accessor(name, getterCallback, setterCallback) {
  definePrototypeAccessor(MediaStream.prototype, name, getterCallback, setterCallback);
}
function method(name, callback) {
  definePrototypeMethod(MediaStream.prototype, name, callback);
}
