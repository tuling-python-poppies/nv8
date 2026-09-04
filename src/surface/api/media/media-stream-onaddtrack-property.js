import { mediaStreamHandlerProperty } from "./media-stream-handler-property.js";
const descriptor = mediaStreamHandlerProperty("onaddtrack");
export const onaddtrack = descriptor.get;
export const setOnaddtrack = descriptor.set;
