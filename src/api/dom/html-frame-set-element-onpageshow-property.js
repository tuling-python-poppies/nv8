import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onpageshow");
export const onpageshow = descriptor.get;
export const setOnpageshow = descriptor.set;
