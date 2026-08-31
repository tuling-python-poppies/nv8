import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncuechange");
export const oncuechange = descriptor.get;
export const setOncuechange = descriptor.set;
