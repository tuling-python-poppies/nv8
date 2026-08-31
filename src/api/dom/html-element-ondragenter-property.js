import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondragenter");
export const ondragenter = descriptor.get;
export const setOndragenter = descriptor.set;
