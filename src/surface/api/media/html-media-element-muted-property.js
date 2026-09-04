import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("muted", Boolean);
export const muted = descriptor.get;
export const setMuted = descriptor.set;
