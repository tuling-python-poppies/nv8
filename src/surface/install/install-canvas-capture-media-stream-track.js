import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CanvasCaptureMediaStreamTrack,
  installCanvasCaptureMediaStreamTrackConstructor,
} from "../api/canvas/canvas-capture-media-stream-track-constructor.js";
import {
  canvas,
} from "../api/canvas/canvas-capture-media-stream-track-canvas-getter.js";
import {
  requestFrame,
} from "../api/canvas/canvas-capture-media-stream-track-request-frame.js";

export function installCanvasCaptureMediaStreamTrack() {
  installCanvasCaptureMediaStreamTrackConstructor();
  definePrototypeGetter(
    CanvasCaptureMediaStreamTrack.prototype,
    "canvas",
    canvas,
  );
  definePrototypeMethod(
    CanvasCaptureMediaStreamTrack.prototype,
    "requestFrame",
    requestFrame,
  );
  defineConstructorBacklink(
    CanvasCaptureMediaStreamTrack.prototype,
    CanvasCaptureMediaStreamTrack,
  );
  defineToStringTag(
    CanvasCaptureMediaStreamTrack.prototype,
    "CanvasCaptureMediaStreamTrack",
  );
}
