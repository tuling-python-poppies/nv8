import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncontextlost");
export const oncontextlost = descriptor.get;
export const setOncontextlost = descriptor.set;
