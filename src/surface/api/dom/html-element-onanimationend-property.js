import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onanimationend");
export const onanimationend = descriptor.get;
export const setOnanimationend = descriptor.set;
