import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onanimationcancel");
export const onanimationcancel = descriptor.get;
export const setOnanimationcancel = descriptor.set;
