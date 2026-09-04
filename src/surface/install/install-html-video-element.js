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
import { disablePictureInPicture, setDisablePictureInPicture } from "../api/media/html-video-element-disable-picture-in-picture-property.js";
import { getVideoPlaybackQuality } from "../api/media/html-video-element-get-video-playback-quality.js";
import { height, setHeight } from "../api/media/html-video-element-height-property.js";
import { msGetVideoProcessingTypes } from "../api/media/html-video-element-ms-get-video-processing-types.js";
import { msVideoProcessing, setMsVideoProcessing } from "../api/media/html-video-element-ms-video-processing-property.js";
import { onenterpictureinpicture, setOnenterpictureinpicture } from "../api/media/html-video-element-onenterpictureinpicture-property.js";
import { onleavepictureinpicture, setOnleavepictureinpicture } from "../api/media/html-video-element-onleavepictureinpicture-property.js";
import { playsInline, setPlaysInline } from "../api/media/html-video-element-plays-inline-property.js";
import { poster, setPoster } from "../api/media/html-video-element-poster-property.js";
import { requestPictureInPicture } from "../api/media/html-video-element-request-picture-in-picture.js";
import { requestVideoFrameCallback } from "../api/media/html-video-element-request-video-frame-callback.js";
import { videoHeight } from "../api/media/html-video-element-video-height-getter.js";
import { videoWidth } from "../api/media/html-video-element-video-width-getter.js";
import { webkitDecodedFrameCount } from "../api/media/html-video-element-webkit-decoded-frame-count-getter.js";
import { webkitDroppedFrameCount } from "../api/media/html-video-element-webkit-dropped-frame-count-getter.js";
import { width, setWidth } from "../api/media/html-video-element-width-property.js";

export function installHTMLVideoElement() {
  installHTMLVideoElementConstructor();
  accessor("width", width, setWidth);
  accessor("height", height, setHeight);
  getter("videoWidth", videoWidth);
  getter("videoHeight", videoHeight);
  accessor("poster", poster, setPoster);
  getter("webkitDecodedFrameCount", webkitDecodedFrameCount);
  getter("webkitDroppedFrameCount", webkitDroppedFrameCount);
  accessor("playsInline", playsInline, setPlaysInline);
  accessor(
    "onenterpictureinpicture",
    onenterpictureinpicture,
    setOnenterpictureinpicture,
  );
  accessor(
    "onleavepictureinpicture",
    onleavepictureinpicture,
    setOnleavepictureinpicture,
  );
  accessor(
    "disablePictureInPicture",
    disablePictureInPicture,
    setDisablePictureInPicture,
  );
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
