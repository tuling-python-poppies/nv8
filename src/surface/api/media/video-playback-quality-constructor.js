import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function VideoPlaybackQuality() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(VideoPlaybackQuality, "VideoPlaybackQuality");

export function installVideoPlaybackQualityConstructor() {
  delete VideoPlaybackQuality.prototype.constructor;
  defineGlobalConstructor("VideoPlaybackQuality", VideoPlaybackQuality);
}
