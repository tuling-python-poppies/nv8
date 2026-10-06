import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onscrollend");
export const onscrollend = descriptor.get;
export const setOnscrollend = descriptor.set;
