import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("currentTime", value => Math.max(0, Number(value)));
export const currentTime = descriptor.get;
export const setCurrentTime = descriptor.set;
