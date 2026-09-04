import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncanplaythrough");
export const oncanplaythrough = descriptor.get;
export const setOncanplaythrough = descriptor.set;
