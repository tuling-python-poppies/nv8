import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";
const descriptor = mediaStreamTrackHandlerProperty("oncapturehandlechange");
export const oncapturehandlechange = descriptor.get;
export const setOncapturehandlechange = descriptor.set;
