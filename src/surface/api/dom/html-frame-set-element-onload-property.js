import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onload");
export const onload = descriptor.get;
export const setOnload = descriptor.set;
