import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("playbackRate", Number);
export const playbackRate = descriptor.get;
export const setPlaybackRate = descriptor.set;
