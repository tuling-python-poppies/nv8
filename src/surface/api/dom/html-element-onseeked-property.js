import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onseeked");
export const onseeked = descriptor.get;
export const setOnseeked = descriptor.set;
