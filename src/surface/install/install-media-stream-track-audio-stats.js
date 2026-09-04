import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { averageLatency } from "../api/media/media-stream-track-audio-stats-average-latency-getter.js";
import {
  MediaStreamTrackAudioStats,
  installMediaStreamTrackAudioStatsConstructor,
} from "../api/media/media-stream-track-audio-stats-constructor.js";
import { deliveredFramesDuration } from "../api/media/media-stream-track-audio-stats-delivered-frames-duration-getter.js";
import { deliveredFrames } from "../api/media/media-stream-track-audio-stats-delivered-frames-getter.js";
import { latency } from "../api/media/media-stream-track-audio-stats-latency-getter.js";
import { maximumLatency } from "../api/media/media-stream-track-audio-stats-maximum-latency-getter.js";
import { minimumLatency } from "../api/media/media-stream-track-audio-stats-minimum-latency-getter.js";
import { resetLatency } from "../api/media/media-stream-track-audio-stats-reset-latency.js";
import { toJSON } from "../api/media/media-stream-track-audio-stats-to-json.js";
import { totalFramesDuration } from "../api/media/media-stream-track-audio-stats-total-frames-duration-getter.js";
import { totalFrames } from "../api/media/media-stream-track-audio-stats-total-frames-getter.js";
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
