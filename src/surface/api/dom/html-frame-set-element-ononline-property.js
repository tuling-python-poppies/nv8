import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("ononline");
export const ononline = descriptor.get;
export const setOnonline = descriptor.set;
