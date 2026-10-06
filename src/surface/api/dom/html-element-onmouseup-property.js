import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmouseup");
export const onmouseup = descriptor.get;
export const setOnmouseup = descriptor.set;
