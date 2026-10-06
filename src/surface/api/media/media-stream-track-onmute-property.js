import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";
const descriptor = mediaStreamTrackHandlerProperty("onmute");
export const onmute = descriptor.get;
export const setOnmute = descriptor.set;
