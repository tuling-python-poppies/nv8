import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onwaiting");
export const onwaiting = descriptor.get;
export const setOnwaiting = descriptor.set;
