import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerup");
export const onpointerup = descriptor.get;
export const setOnpointerup = descriptor.set;
