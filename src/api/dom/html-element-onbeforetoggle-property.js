import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onbeforetoggle");
export const onbeforetoggle = descriptor.get;
export const setOnbeforetoggle = descriptor.set;
