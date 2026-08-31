import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ontransitionstart");
export const ontransitionstart = descriptor.get;
export const setOntransitionstart = descriptor.set;
