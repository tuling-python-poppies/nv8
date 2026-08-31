import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onload");
export const onload = descriptor.get;
export const setOnload = descriptor.set;
