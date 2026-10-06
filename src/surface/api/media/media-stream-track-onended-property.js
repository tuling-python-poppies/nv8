import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";
const descriptor = mediaStreamTrackHandlerProperty("onended");
export const onended = descriptor.get;
export const setOnended = descriptor.set;
