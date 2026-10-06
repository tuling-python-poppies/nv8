import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondragstart");
export const ondragstart = descriptor.get;
export const setOndragstart = descriptor.set;
