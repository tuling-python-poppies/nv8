import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onkeypress");
export const onkeypress = descriptor.get;
export const setOnkeypress = descriptor.set;
