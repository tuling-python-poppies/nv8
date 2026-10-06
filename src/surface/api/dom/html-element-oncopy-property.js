import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncopy");
export const oncopy = descriptor.get;
export const setOncopy = descriptor.set;
