import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onblur");
export const onblur = descriptor.get;
export const setOnblur = descriptor.set;
