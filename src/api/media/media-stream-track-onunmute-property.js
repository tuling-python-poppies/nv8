import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";
const descriptor = mediaStreamTrackHandlerProperty("onunmute");
export const onunmute = descriptor.get;
export const setOnunmute = descriptor.set;
