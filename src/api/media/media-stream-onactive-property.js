import { mediaStreamHandlerProperty } from "./media-stream-handler-property.js";
const descriptor = mediaStreamHandlerProperty("onactive");
export const onactive = descriptor.get;
export const setOnactive = descriptor.set;
