import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onselect");
export const onselect = descriptor.get;
export const setOnselect = descriptor.set;
