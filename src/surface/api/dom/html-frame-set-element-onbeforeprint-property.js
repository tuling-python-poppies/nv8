import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onbeforeprint");
export const onbeforeprint = descriptor.get;
export const setOnbeforeprint = descriptor.set;
