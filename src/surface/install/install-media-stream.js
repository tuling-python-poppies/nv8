import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
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
import { removeTrack } from "../api/media/media-stream-remove-track.js";
import { mediaStreamHandlerPropertyTable } from "../api/media/media-stream-handler-property-members.js";

export function installMediaStream() {
  installMediaStreamConstructor();
  getter("id", id);
  getter("active", active);
  for (const [name, entry] of mediaStreamHandlerPropertyTable) accessor(name, entry.get, entry.set);
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
