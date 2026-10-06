import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onselectstart");
export const onselectstart = descriptor.get;
export const setOnselectstart = descriptor.set;
