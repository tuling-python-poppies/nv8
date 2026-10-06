import { videoProperty } from "./html-video-element-property.js";
const descriptor = videoProperty("height", value => Number(value) >>> 0);
export const height = descriptor.get;
export const setHeight = descriptor.set;
