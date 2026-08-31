import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("defaultMuted", Boolean);
export const defaultMuted = descriptor.get;
export const setDefaultMuted = descriptor.set;
