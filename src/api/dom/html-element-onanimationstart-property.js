import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onanimationstart");
export const onanimationstart = descriptor.get;
export const setOnanimationstart = descriptor.set;
