import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerenter");
export const onpointerenter = descriptor.get;
export const setOnpointerenter = descriptor.set;
