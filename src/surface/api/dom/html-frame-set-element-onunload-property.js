import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onunload");
export const onunload = descriptor.get;
export const setOnunload = descriptor.set;
