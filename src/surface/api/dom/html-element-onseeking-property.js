import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onseeking");
export const onseeking = descriptor.get;
export const setOnseeking = descriptor.set;
