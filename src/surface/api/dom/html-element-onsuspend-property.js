import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onsuspend");
export const onsuspend = descriptor.get;
export const setOnsuspend = descriptor.set;
