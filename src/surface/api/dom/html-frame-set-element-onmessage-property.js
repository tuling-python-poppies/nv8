import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onmessage");
export const onmessage = descriptor.get;
export const setOnmessage = descriptor.set;
