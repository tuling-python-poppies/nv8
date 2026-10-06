import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondragend");
export const ondragend = descriptor.get;
export const setOndragend = descriptor.set;
