import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onafterprint");
export const onafterprint = descriptor.get;
export const setOnafterprint = descriptor.set;
