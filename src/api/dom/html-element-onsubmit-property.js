import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onsubmit");
export const onsubmit = descriptor.get;
export const setOnsubmit = descriptor.set;
