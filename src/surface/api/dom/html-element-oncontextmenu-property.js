import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncontextmenu");
export const oncontextmenu = descriptor.get;
export const setOncontextmenu = descriptor.set;
