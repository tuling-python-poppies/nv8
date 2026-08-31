import { mediaHandlerProperty } from "./html-media-element-property.js";
const descriptor = mediaHandlerProperty("onencrypted");
export const onencrypted = descriptor.get;
export const setOnencrypted = descriptor.set;
