// media 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { mediaReadonlyProperty } from "./html-media-element-property.js";

export const currentSrc = mediaReadonlyProperty("currentSrc");
export const duration = mediaReadonlyProperty("duration");
export const ended = mediaReadonlyProperty("ended");
export const error = mediaReadonlyProperty("error", () => null);
export const mediaKeys = mediaReadonlyProperty("mediaKeys");
export const networkState = mediaReadonlyProperty("networkState");
export const paused = mediaReadonlyProperty("paused");
export const readyState = mediaReadonlyProperty("readyState");
export const remote = mediaReadonlyProperty("remote");
export const seeking = mediaReadonlyProperty("seeking");
export const sinkId = mediaReadonlyProperty("sinkId");
export const textTracks = mediaReadonlyProperty("textTracks");
