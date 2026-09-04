import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onended");
export const onended = descriptor.get;
export const setOnended = descriptor.set;
