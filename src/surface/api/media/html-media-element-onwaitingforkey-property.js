import { mediaHandlerProperty } from "./html-media-element-property.js";
const descriptor = mediaHandlerProperty("onwaitingforkey");
export const onwaitingforkey = descriptor.get;
export const setOnwaitingforkey = descriptor.set;
