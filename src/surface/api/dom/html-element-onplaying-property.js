import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onplaying");
export const onplaying = descriptor.get;
export const setOnplaying = descriptor.set;
