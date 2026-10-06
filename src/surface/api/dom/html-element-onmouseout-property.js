import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmouseout");
export const onmouseout = descriptor.get;
export const setOnmouseout = descriptor.set;
