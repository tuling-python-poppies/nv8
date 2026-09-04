import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onblur");
export const onblur = descriptor.get;
export const setOnblur = descriptor.set;
