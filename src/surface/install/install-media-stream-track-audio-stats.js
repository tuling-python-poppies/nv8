import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  MediaStreamTrackAudioStats,
  installMediaStreamTrackAudioStatsConstructor,
} from "../api/media/media-stream-track-audio-stats-constructor.js";
import { resetLatency } from "../api/media/media-stream-track-audio-stats-reset-latency.js";
import { toJSON } from "../api/media/media-stream-track-audio-stats-to-json.js";
import { audioStatsNumberGetterTable } from "../api/media/audio-stats-number-getter-members.js";

export function installMediaStreamTrackAudioStats() {
  installMediaStreamTrackAudioStatsConstructor();
  for (const [name, entry] of audioStatsNumberGetterTable) getter(name, entry);
  definePrototypeMethod(MediaStreamTrackAudioStats.prototype, "resetLatency", resetLatency);
  definePrototypeMethod(MediaStreamTrackAudioStats.prototype, "toJSON", toJSON);
  defineConstructorBacklink(MediaStreamTrackAudioStats.prototype, MediaStreamTrackAudioStats);
  defineToStringTag(MediaStreamTrackAudioStats.prototype, "MediaStreamTrackAudioStats");
}
function getter(name, callback) {
  definePrototypeGetter(MediaStreamTrackAudioStats.prototype, name, callback);
}
