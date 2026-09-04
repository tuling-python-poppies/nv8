import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmousemove");
export const onmousemove = descriptor.get;
export const setOnmousemove = descriptor.set;
