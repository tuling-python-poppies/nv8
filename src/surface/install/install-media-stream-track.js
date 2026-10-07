import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
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
import { stop } from "../api/media/media-stream-track-stop.js";
import {
  mediaStreamTrackHandlerPropertyPart1Table,
  mediaStreamTrackHandlerPropertyPart2Table,
  mediaStreamTrackHandlerPropertyPart3Table,
} from "../api/media/media-stream-track-handler-property-members.js";
import {
  mediaStreamTrackReadonlyGetterPart1Table,
  mediaStreamTrackReadonlyGetterPart2Table,
  mediaStreamTrackReadonlyGetterPart3Table,
  mediaStreamTrackReadonlyGetterPart4Table,
} from "../api/media/media-stream-track-readonly-getter-members.js";

export function installMediaStreamTrack() {
  installMediaStreamTrackConstructor();
  for (const [name, entry] of mediaStreamTrackReadonlyGetterPart1Table) getter(name, entry);
  accessor("enabled", enabled, setEnabled);
  for (const [name, entry] of mediaStreamTrackReadonlyGetterPart2Table) getter(name, entry);
  for (const [name, entry] of mediaStreamTrackHandlerPropertyPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of mediaStreamTrackReadonlyGetterPart3Table) getter(name, entry);
  for (const [name, entry] of mediaStreamTrackHandlerPropertyPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of mediaStreamTrackReadonlyGetterPart4Table) getter(name, entry);
  accessor("contentHint", contentHint, setContentHint);
  method("applyConstraints", applyConstraints);
  method("clone", clone);
  method("getCapabilities", getCapabilities);
  method("getConstraints", getConstraints);
  method("getSettings", getSettings);
  method("stop", stop);
  for (const [name, entry] of mediaStreamTrackHandlerPropertyPart3Table) accessor(name, entry.get, entry.set);
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
