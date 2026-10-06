import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onformdata");
export const onformdata = descriptor.get;
export const setOnformdata = descriptor.set;
