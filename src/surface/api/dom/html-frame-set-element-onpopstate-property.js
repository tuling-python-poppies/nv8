import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onpopstate");
export const onpopstate = descriptor.get;
export const setOnpopstate = descriptor.set;
