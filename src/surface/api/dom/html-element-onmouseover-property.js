import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmouseover");
export const onmouseover = descriptor.get;
export const setOnmouseover = descriptor.set;
