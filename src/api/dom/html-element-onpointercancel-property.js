import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointercancel");
export const onpointercancel = descriptor.get;
export const setOnpointercancel = descriptor.set;
