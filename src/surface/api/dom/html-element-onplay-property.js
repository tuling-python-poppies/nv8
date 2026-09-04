import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onplay");
export const onplay = descriptor.get;
export const setOnplay = descriptor.set;
