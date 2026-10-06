import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondragover");
export const ondragover = descriptor.get;
export const setOndragover = descriptor.set;
