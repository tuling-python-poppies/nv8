import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
export function MediaStreamTrackAudioStats() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MediaStreamTrackAudioStats, "MediaStreamTrackAudioStats");
export function installMediaStreamTrackAudioStatsConstructor() {
  delete MediaStreamTrackAudioStats.prototype.constructor;
  defineGlobalConstructor("MediaStreamTrackAudioStats", MediaStreamTrackAudioStats);
}
