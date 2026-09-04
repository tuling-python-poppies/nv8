import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ondragleave");
export const ondragleave = descriptor.get;
export const setOndragleave = descriptor.set;
