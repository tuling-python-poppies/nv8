import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onchange");
export const onchange = descriptor.get;
export const setOnchange = descriptor.set;
