import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onscroll");
export const onscroll = descriptor.get;
export const setOnscroll = descriptor.set;
