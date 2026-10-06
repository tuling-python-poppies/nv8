import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondrag");
export const ondrag = descriptor.get;
export const setOndrag = descriptor.set;
