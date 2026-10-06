import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerleave");
export const onpointerleave = descriptor.get;
export const setOnpointerleave = descriptor.set;
