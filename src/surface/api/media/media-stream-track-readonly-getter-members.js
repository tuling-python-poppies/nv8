// media 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { mediaStreamTrackReadonlyGetter } from "./media-stream-track-readonly-getter.js";

export const id = mediaStreamTrackReadonlyGetter("id");
export const kind = mediaStreamTrackReadonlyGetter("kind");
export const label = mediaStreamTrackReadonlyGetter("label");
export const muted = mediaStreamTrackReadonlyGetter("muted");
export const readyState = mediaStreamTrackReadonlyGetter("readyState");
export const stats = mediaStreamTrackReadonlyGetter("stats");
