import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onerror");
export const onerror = descriptor.get;
export const setOnerror = descriptor.set;
