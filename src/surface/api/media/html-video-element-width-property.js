import { videoProperty } from "./html-video-element-property.js";
const descriptor = videoProperty("width", value => Number(value) >>> 0);
export const width = descriptor.get;
export const setWidth = descriptor.set;
