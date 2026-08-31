import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onerror");
export const onerror = descriptor.get;
export const setOnerror = descriptor.set;
