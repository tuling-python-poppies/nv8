import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onoffline");
export const onoffline = descriptor.get;
export const setOnoffline = descriptor.set;
