import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondrop");
export const ondrop = descriptor.get;
export const setOndrop = descriptor.set;
