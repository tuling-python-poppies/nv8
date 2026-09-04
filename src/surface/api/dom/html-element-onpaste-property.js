import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpaste");
export const onpaste = descriptor.get;
export const setOnpaste = descriptor.set;
