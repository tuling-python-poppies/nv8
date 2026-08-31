import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onresize");
export const onresize = descriptor.get;
export const setOnresize = descriptor.set;
