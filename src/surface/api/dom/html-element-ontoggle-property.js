import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ontoggle");
export const ontoggle = descriptor.get;
export const setOntoggle = descriptor.set;
