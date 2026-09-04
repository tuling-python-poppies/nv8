import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("autoplay", Boolean);
export const autoplay = descriptor.get;
export const setAutoplay = descriptor.set;
