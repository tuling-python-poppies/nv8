import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onloadedmetadata");
export const onloadedmetadata = descriptor.get;
export const setOnloadedmetadata = descriptor.set;
