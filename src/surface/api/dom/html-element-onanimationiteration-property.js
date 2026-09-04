import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onanimationiteration");
export const onanimationiteration = descriptor.get;
export const setOnanimationiteration = descriptor.set;
