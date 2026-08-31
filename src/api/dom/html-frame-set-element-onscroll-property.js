import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onscroll");
export const onscroll = descriptor.get;
export const setOnscroll = descriptor.set;
