import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onmousewheel");
export const onmousewheel = descriptor.get;
export const setOnmousewheel = descriptor.set;
