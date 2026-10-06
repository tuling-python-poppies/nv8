import { mediaStreamHandlerProperty } from "./media-stream-handler-property.js";
const descriptor = mediaStreamHandlerProperty("onremovetrack");
export const onremovetrack = descriptor.get;
export const setOnremovetrack = descriptor.set;
