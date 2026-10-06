import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  averageLatency,
  deliveredFramesDuration,
  deliveredFrames,
  latency,
  maximumLatency,
  minimumLatency,
  totalFramesDuration,
  totalFrames,
} from "../api/media/audio-stats-number-getter-members.js";
import {
  MediaStreamTrackAudioStats,
  installMediaStreamTrackAudioStatsConstructor,
} from "../api/media/media-stream-track-audio-stats-constructor.js";
import { resetLatency } from "../api/media/media-stream-track-audio-stats-reset-latency.js";
import { toJSON } from "../api/media/media-stream-track-audio-stats-to-json.js";

export function installMediaStreamTrackAudioStats() {
  installMediaStreamTrackAudioStatsConstructor();
  getter("deliveredFrames", deliveredFrames);
  getter("deliveredFramesDuration", deliveredFramesDuration);
  getter("totalFrames", totalFrames);
  getter("totalFramesDuration", totalFramesDuration);
  getter("latency", latency);
  getter("averageLatency", averageLatency);
  getter("minimumLatency", minimumLatency);
  getter("maximumLatency", maximumLatency);
  definePrototypeMethod(MediaStreamTrackAudioStats.prototype, "resetLatency", resetLatency);
  definePrototypeMethod(MediaStreamTrackAudioStats.prototype, "toJSON", toJSON);
  defineConstructorBacklink(MediaStreamTrackAudioStats.prototype, MediaStreamTrackAudioStats);
  defineToStringTag(MediaStreamTrackAudioStats.prototype, "MediaStreamTrackAudioStats");
}
function getter(name, callback) {
  definePrototypeGetter(MediaStreamTrackAudioStats.prototype, name, callback);
}
