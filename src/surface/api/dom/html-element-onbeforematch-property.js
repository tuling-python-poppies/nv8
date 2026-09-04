import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onbeforematch");
export const onbeforematch = descriptor.get;
export const setOnbeforematch = descriptor.set;
