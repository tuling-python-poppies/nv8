// media 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { qualityNumberGetter } from "./video-playback-quality-number-getter.js";

export const corruptedVideoFrames = qualityNumberGetter("corruptedVideoFrames");
export const creationTime = qualityNumberGetter("creationTime");
export const droppedVideoFrames = qualityNumberGetter("droppedVideoFrames");
export const totalVideoFrames = qualityNumberGetter("totalVideoFrames");
