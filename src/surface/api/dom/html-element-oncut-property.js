import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncut");
export const oncut = descriptor.get;
export const setOncut = descriptor.set;
