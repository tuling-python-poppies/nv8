import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onkeydown");
export const onkeydown = descriptor.get;
export const setOnkeydown = descriptor.set;
