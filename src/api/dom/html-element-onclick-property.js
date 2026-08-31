import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onclick");
export const onclick = descriptor.get;
export const setOnclick = descriptor.set;
