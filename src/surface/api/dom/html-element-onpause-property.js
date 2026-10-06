import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpause");
export const onpause = descriptor.get;
export const setOnpause = descriptor.set;
