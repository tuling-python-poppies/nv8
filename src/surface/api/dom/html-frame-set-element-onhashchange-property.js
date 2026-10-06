import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onhashchange");
export const onhashchange = descriptor.get;
export const setOnhashchange = descriptor.set;
