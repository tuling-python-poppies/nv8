import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("defaultPlaybackRate", Number);
export const defaultPlaybackRate = descriptor.get;
export const setDefaultPlaybackRate = descriptor.set;
