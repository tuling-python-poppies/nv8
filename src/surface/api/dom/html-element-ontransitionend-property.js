import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ontransitionend");
export const ontransitionend = descriptor.get;
export const setOntransitionend = descriptor.set;
