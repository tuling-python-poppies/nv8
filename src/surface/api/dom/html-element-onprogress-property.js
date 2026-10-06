import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onprogress");
export const onprogress = descriptor.get;
export const setOnprogress = descriptor.set;
