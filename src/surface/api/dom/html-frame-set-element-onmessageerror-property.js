import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onmessageerror");
export const onmessageerror = descriptor.get;
export const setOnmessageerror = descriptor.set;
