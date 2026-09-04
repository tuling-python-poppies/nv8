import { videoProperty } from "./html-video-element-property.js";
const valid = new Set([
  "bicubic",
  "lanczos",
  "cas",
  "default",
  "msSuperResolution",
  "msGraphicsDriverEnhancement",
]);
const descriptor = videoProperty("msVideoProcessing", value => {
  const normalized = `${value}`;
  if (!valid.has(normalized)) throw new TypeError("Invalid video processing type");
  return normalized;
});
export const msVideoProcessing = descriptor.get;
export const setMsVideoProcessing = descriptor.set;
