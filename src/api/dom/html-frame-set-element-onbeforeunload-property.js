import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onbeforeunload");
export const onbeforeunload = descriptor.get;
export const setOnbeforeunload = descriptor.set;
