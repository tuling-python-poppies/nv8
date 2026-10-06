import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncanplay");
export const oncanplay = descriptor.get;
export const setOncanplay = descriptor.set;
