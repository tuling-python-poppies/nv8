import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onemptied");
export const onemptied = descriptor.get;
export const setOnemptied = descriptor.set;
