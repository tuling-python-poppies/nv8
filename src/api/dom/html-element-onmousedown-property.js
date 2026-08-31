import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmousedown");
export const onmousedown = descriptor.get;
export const setOnmousedown = descriptor.set;
