import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onslotchange");
export const onslotchange = descriptor.get;
export const setOnslotchange = descriptor.set;
