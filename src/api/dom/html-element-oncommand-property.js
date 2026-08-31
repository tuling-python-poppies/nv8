import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncommand");
export const oncommand = descriptor.get;
export const setOncommand = descriptor.set;
