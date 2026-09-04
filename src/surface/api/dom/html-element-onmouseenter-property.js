import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmouseenter");
export const onmouseenter = descriptor.get;
export const setOnmouseenter = descriptor.set;
