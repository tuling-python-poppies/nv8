import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { addTextTrack } from "../api/media/html-media-element-add-text-track.js";
import { buffered } from "../api/media/html-media-element-buffered-getter.js";
import { canPlayType } from "../api/media/html-media-element-can-play-type.js";
import { captureStream } from "../api/media/html-media-element-capture-stream.js";
import { controlsList, setControlsList } from "../api/media/html-media-element-controls-list-property.js";
import { crossOrigin, setCrossOrigin } from "../api/media/html-media-element-cross-origin-property.js";
import {
  HTMLMediaElement,
  installHTMLMediaElementConstructor,
} from "../api/media/html-media-element-constructor.js";
import { load } from "../api/media/html-media-element-load.js";
import { pause } from "../api/media/html-media-element-pause.js";
import { play } from "../api/media/html-media-element-play.js";
import { played } from "../api/media/html-media-element-played-getter.js";
import { preload, setPreload } from "../api/media/html-media-element-preload-property.js";
import { seekable } from "../api/media/html-media-element-seekable-getter.js";
import { setMediaKeys } from "../api/media/html-media-element-set-media-keys.js";
import { setSinkId } from "../api/media/html-media-element-set-sink-id.js";
import { srcObject, setSrcObject } from "../api/media/html-media-element-src-object-property.js";
import { src, setSrc } from "../api/media/html-media-element-src-property.js";
import { volume, setVolume } from "../api/media/html-media-element-volume-property.js";
import { webkitAudioDecodedByteCount } from "../api/media/html-media-element-webkit-audio-decoded-byte-count-getter.js";
import { webkitVideoDecodedByteCount } from "../api/media/html-media-element-webkit-video-decoded-byte-count-getter.js";
import {
  mediaPropertyPart1Table,
  mediaPropertyPart2Table,
  mediaPropertyPart3Table,
  mediaPropertyPart4Table,
  mediaPropertyPart5Table,
  mediaPropertyPart6Table,
} from "../api/media/media-property-members.js";
import { mediaHandlerPropertyTable } from "../api/media/media-handler-property-members.js";
import {
  mediaReadonlyPropertyPart1Table,
  mediaReadonlyPropertyPart2Table,
  mediaReadonlyPropertyPart3Table,
  mediaReadonlyPropertyPart4Table,
  mediaReadonlyPropertyPart5Table,
  mediaReadonlyPropertyPart6Table,
  mediaReadonlyPropertyPart7Table,
  mediaReadonlyPropertyPart8Table,
  mediaReadonlyPropertyPart9Table,
} from "../api/media/media-readonly-property-members.js";

export function installHTMLMediaElement() {
  installHTMLMediaElementConstructor();
  for (const [name, entry] of mediaReadonlyPropertyPart1Table) getter(name, entry);
  accessor("src", src, setSrc);
  for (const [name, entry] of mediaReadonlyPropertyPart2Table) getter(name, entry);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  for (const [name, entry] of mediaReadonlyPropertyPart3Table) getter(name, entry);
  accessor("preload", preload, setPreload);
  getter("buffered", buffered);
  for (const [name, entry] of mediaReadonlyPropertyPart4Table) getter(name, entry);
  for (const [name, entry] of mediaPropertyPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of mediaReadonlyPropertyPart5Table) getter(name, entry);
  for (const [name, entry] of mediaPropertyPart2Table) accessor(name, entry.get, entry.set);
  getter("played", played);
  getter("seekable", seekable);
  for (const [name, entry] of mediaReadonlyPropertyPart6Table) getter(name, entry);
  for (const [name, entry] of mediaPropertyPart3Table) accessor(name, entry.get, entry.set);
  accessor("controlsList", controlsList, setControlsList);
  accessor("volume", volume, setVolume);
  for (const [name, entry] of mediaPropertyPart4Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of mediaReadonlyPropertyPart7Table) getter(name, entry);
  getter("webkitAudioDecodedByteCount", webkitAudioDecodedByteCount);
  getter("webkitVideoDecodedByteCount", webkitVideoDecodedByteCount);
  for (const [name, entry] of mediaHandlerPropertyTable) accessor(name, entry.get, entry.set);
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
  for (const [name, entry] of mediaPropertyPart5Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of mediaReadonlyPropertyPart8Table) getter(name, entry);
  for (const [name, entry] of mediaPropertyPart6Table) accessor(name, entry.get, entry.set);
  method("setSinkId", setSinkId);
  defineConstructorBacklink(HTMLMediaElement.prototype, HTMLMediaElement);
  for (const [name, entry] of mediaReadonlyPropertyPart9Table) getter(name, entry);
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
