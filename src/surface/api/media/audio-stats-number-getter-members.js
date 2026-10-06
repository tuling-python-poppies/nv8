// media 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { audioStatsNumberGetter } from "./media-stream-track-audio-stats-number-getter.js";

export const averageLatency = audioStatsNumberGetter("averageLatency");
export const deliveredFrames = audioStatsNumberGetter("deliveredFrames");
export const deliveredFramesDuration = audioStatsNumberGetter("deliveredFramesDuration");
export const latency = audioStatsNumberGetter("latency");
export const maximumLatency = audioStatsNumberGetter("maximumLatency");
export const minimumLatency = audioStatsNumberGetter("minimumLatency");
export const totalFrames = audioStatsNumberGetter("totalFrames");
export const totalFramesDuration = audioStatsNumberGetter("totalFramesDuration");
