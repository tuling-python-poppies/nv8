import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("loop", Boolean);
export const loop = descriptor.get;
export const setLoop = descriptor.set;
