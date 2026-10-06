import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onwheel");
export const onwheel = descriptor.get;
export const setOnwheel = descriptor.set;
