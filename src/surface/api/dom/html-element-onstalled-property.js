import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onstalled");
export const onstalled = descriptor.get;
export const setOnstalled = descriptor.set;
