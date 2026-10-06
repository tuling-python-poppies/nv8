import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onfocus");
export const onfocus = descriptor.get;
export const setOnfocus = descriptor.set;
