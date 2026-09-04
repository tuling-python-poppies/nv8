import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondblclick");
export const ondblclick = descriptor.get;
export const setOndblclick = descriptor.set;
