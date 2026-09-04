import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  VideoPlaybackQuality,
  installVideoPlaybackQualityConstructor,
} from "../api/media/video-playback-quality-constructor.js";
import { creationTime } from "../api/media/video-playback-quality-creation-time-getter.js";
import { totalVideoFrames } from "../api/media/video-playback-quality-total-video-frames-getter.js";
import { droppedVideoFrames } from "../api/media/video-playback-quality-dropped-video-frames-getter.js";
import { corruptedVideoFrames } from "../api/media/video-playback-quality-corrupted-video-frames-getter.js";

export function installVideoPlaybackQuality() {
  installVideoPlaybackQualityConstructor();
  definePrototypeGetter(VideoPlaybackQuality.prototype, "creationTime", creationTime);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "totalVideoFrames", totalVideoFrames);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "droppedVideoFrames", droppedVideoFrames);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "corruptedVideoFrames", corruptedVideoFrames);
  defineConstructorBacklink(VideoPlaybackQuality.prototype, VideoPlaybackQuality);
  defineToStringTag(VideoPlaybackQuality.prototype, "VideoPlaybackQuality");
}
