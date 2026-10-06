import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerover");
export const onpointerover = descriptor.get;
export const setOnpointerover = descriptor.set;
