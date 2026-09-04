import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncancel");
export const oncancel = descriptor.get;
export const setOncancel = descriptor.set;
