import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  VideoPlaybackQuality,
  installVideoPlaybackQualityConstructor,
} from "../api/media/video-playback-quality-constructor.js";
import { qualityNumberGetterTable } from "../api/media/quality-number-getter-members.js";

export function installVideoPlaybackQuality() {
  installVideoPlaybackQualityConstructor();
  for (const [name, entry] of qualityNumberGetterTable) definePrototypeGetter(VideoPlaybackQuality.prototype, name, entry);
  defineConstructorBacklink(VideoPlaybackQuality.prototype, VideoPlaybackQuality);
  defineToStringTag(VideoPlaybackQuality.prototype, "VideoPlaybackQuality");
}
