import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ontimeupdate");
export const ontimeupdate = descriptor.get;
export const setOntimeupdate = descriptor.set;
