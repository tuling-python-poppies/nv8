import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmouseleave");
export const onmouseleave = descriptor.get;
export const setOnmouseleave = descriptor.set;
