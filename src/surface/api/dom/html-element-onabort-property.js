import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onabort");
export const onabort = descriptor.get;
export const setOnabort = descriptor.set;
