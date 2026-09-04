import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export function MediaStreamTrackAudioStats() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MediaStreamTrackAudioStats, "MediaStreamTrackAudioStats");
export function installMediaStreamTrackAudioStatsConstructor() {
  delete MediaStreamTrackAudioStats.prototype.constructor;
  defineGlobalConstructor("MediaStreamTrackAudioStats", MediaStreamTrackAudioStats);
}
