import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onpagehide");
export const onpagehide = descriptor.get;
export const setOnpagehide = descriptor.set;
