import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onresize");
export const onresize = descriptor.get;
export const setOnresize = descriptor.set;
