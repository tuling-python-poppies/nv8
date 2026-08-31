import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onclose");
export const onclose = descriptor.get;
export const setOnclose = descriptor.set;
