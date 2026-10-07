import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cancelVideoFrameCallback } from "../api/media/html-video-element-cancel-video-frame-callback.js";
import {
  HTMLVideoElement,
  installHTMLVideoElementConstructor,
} from "../api/media/html-video-element-constructor.js";
import { getVideoPlaybackQuality } from "../api/media/html-video-element-get-video-playback-quality.js";
import { msGetVideoProcessingTypes } from "../api/media/html-video-element-ms-get-video-processing-types.js";
import { msVideoProcessing, setMsVideoProcessing } from "../api/media/html-video-element-ms-video-processing-property.js";
import { requestPictureInPicture } from "../api/media/html-video-element-request-picture-in-picture.js";
import { requestVideoFrameCallback } from "../api/media/html-video-element-request-video-frame-callback.js";
import { webkitDecodedFrameCount } from "../api/media/html-video-element-webkit-decoded-frame-count-getter.js";
import { webkitDroppedFrameCount } from "../api/media/html-video-element-webkit-dropped-frame-count-getter.js";
import {
  videoPropertyPart1Table,
  videoPropertyPart2Table,
  videoPropertyPart3Table,
  videoPropertyPart4Table,
} from "../api/media/video-property-members.js";
import { videoHandlerPropertyTable } from "../api/media/video-handler-property-members.js";
import { videoReadonlyPropertyTable } from "../api/media/video-readonly-property-members.js";

export function installHTMLVideoElement() {
  installHTMLVideoElementConstructor();
  for (const [name, entry] of videoPropertyPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of videoReadonlyPropertyTable) getter(name, entry);
  for (const [name, entry] of videoPropertyPart2Table) accessor(name, entry.get, entry.set);
  getter("webkitDecodedFrameCount", webkitDecodedFrameCount);
  getter("webkitDroppedFrameCount", webkitDroppedFrameCount);
  for (const [name, entry] of videoPropertyPart3Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of videoHandlerPropertyTable) accessor( name, entry.get, entry.set, );
  for (const [name, entry] of videoPropertyPart4Table) accessor( name, entry.get, entry.set, );
  method("cancelVideoFrameCallback", cancelVideoFrameCallback);
  method("getVideoPlaybackQuality", getVideoPlaybackQuality);
  method("requestPictureInPicture", requestPictureInPicture);
  method("requestVideoFrameCallback", requestVideoFrameCallback);
  accessor("msVideoProcessing", msVideoProcessing, setMsVideoProcessing);
  method("msGetVideoProcessingTypes", msGetVideoProcessingTypes);
  defineConstructorBacklink(HTMLVideoElement.prototype, HTMLVideoElement);
  defineToStringTag(HTMLVideoElement.prototype, "HTMLVideoElement");
}

function getter(name, callback) {
  definePrototypeGetter(HTMLVideoElement.prototype, name, callback);
}
function accessor(name, getterCallback, setterCallback) {
  definePrototypeAccessor(
    HTMLVideoElement.prototype,
    name,
    getterCallback,
    setterCallback,
  );
}
function method(name, callback) {
  definePrototypeMethod(HTMLVideoElement.prototype, name, callback);
}
