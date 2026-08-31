import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onloadstart");
export const onloadstart = descriptor.get;
export const setOnloadstart = descriptor.set;
