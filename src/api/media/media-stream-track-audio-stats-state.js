import { MediaStreamTrackAudioStats } from "./media-stream-track-audio-stats-constructor.js";
const state = new WeakMap();
export function createMediaStreamTrackAudioStats() {
  const stats = Object.create(MediaStreamTrackAudioStats.prototype);
  state.set(stats, {
    deliveredFrames: 0,
    deliveredFramesDuration: 0,
    totalFrames: 0,
    totalFramesDuration: 0,
    latency: 0,
    averageLatency: 0,
    minimumLatency: 0,
    maximumLatency: 0,
  });
  return stats;
}
export function requireMediaStreamTrackAudioStats(stats) {
  const value = state.get(stats);
  if (value === undefined) throw new TypeError("Illegal invocation");
  return value;
}
