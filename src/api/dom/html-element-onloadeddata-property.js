import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onloadeddata");
export const onloadeddata = descriptor.get;
export const setOnloadeddata = descriptor.set;
