import { VideoPlaybackQuality } from "./video-playback-quality-constructor.js";

const qualityState = new WeakMap();

export function createVideoPlaybackQuality(
  creationTime = 0,
  totalVideoFrames = 0,
  droppedVideoFrames = 0,
  corruptedVideoFrames = 0,
) {
  const quality = Object.create(VideoPlaybackQuality.prototype);
  qualityState.set(quality, {
    creationTime: Number(creationTime),
    totalVideoFrames: Number(totalVideoFrames),
    droppedVideoFrames: Number(droppedVideoFrames),
    corruptedVideoFrames: Number(corruptedVideoFrames),
  });
  return quality;
}

export function requireVideoPlaybackQuality(quality) {
  const state = qualityState.get(quality);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
