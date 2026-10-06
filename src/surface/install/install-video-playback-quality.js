import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  VideoPlaybackQuality,
  installVideoPlaybackQualityConstructor,
} from "../api/media/video-playback-quality-constructor.js";
import {
  creationTime,
  totalVideoFrames,
  droppedVideoFrames,
  corruptedVideoFrames,
} from "../api/media/quality-number-getter-members.js";

export function installVideoPlaybackQuality() {
  installVideoPlaybackQualityConstructor();
  definePrototypeGetter(VideoPlaybackQuality.prototype, "creationTime", creationTime);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "totalVideoFrames", totalVideoFrames);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "droppedVideoFrames", droppedVideoFrames);
  definePrototypeGetter(VideoPlaybackQuality.prototype, "corruptedVideoFrames", corruptedVideoFrames);
  defineConstructorBacklink(VideoPlaybackQuality.prototype, VideoPlaybackQuality);
  defineToStringTag(VideoPlaybackQuality.prototype, "VideoPlaybackQuality");
}
