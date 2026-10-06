import { videoProperty } from "./html-video-element-property.js";
const descriptor = videoProperty("poster", value => `${value}`);
export const poster = descriptor.get;
export const setPoster = descriptor.set;
