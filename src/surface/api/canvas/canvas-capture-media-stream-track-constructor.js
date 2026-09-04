import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { MediaStreamTrack } from "../media/media-stream-track-constructor.js";

export function CanvasCaptureMediaStreamTrack() {
  throw new TypeError(
    "Failed to construct 'CanvasCaptureMediaStreamTrack': Illegal constructor",
  );
}
registerNativeFunction(
  CanvasCaptureMediaStreamTrack,
  "CanvasCaptureMediaStreamTrack",
);

export function installCanvasCaptureMediaStreamTrackConstructor() {
  Object.setPrototypeOf(
    CanvasCaptureMediaStreamTrack.prototype,
    MediaStreamTrack.prototype,
  );
  Object.setPrototypeOf(CanvasCaptureMediaStreamTrack, MediaStreamTrack);
  delete CanvasCaptureMediaStreamTrack.prototype.constructor;
  defineGlobalConstructor(
    "CanvasCaptureMediaStreamTrack",
    CanvasCaptureMediaStreamTrack,
  );
}
