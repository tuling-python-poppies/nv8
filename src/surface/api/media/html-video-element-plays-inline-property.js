import { videoProperty } from "./html-video-element-property.js";
const descriptor = videoProperty("playsInline", Boolean);
export const playsInline = descriptor.get;
export const setPlaysInline = descriptor.set;
