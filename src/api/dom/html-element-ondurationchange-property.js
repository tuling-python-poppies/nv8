import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondurationchange");
export const ondurationchange = descriptor.get;
export const setOndurationchange = descriptor.set;
