import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onfocus");
export const onfocus = descriptor.get;
export const setOnfocus = descriptor.set;
