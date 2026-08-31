import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onkeyup");
export const onkeyup = descriptor.get;
export const setOnkeyup = descriptor.set;
