import { mediaStreamHandlerProperty } from "./media-stream-handler-property.js";
const descriptor = mediaStreamHandlerProperty("oninactive");
export const oninactive = descriptor.get;
export const setOninactive = descriptor.set;
