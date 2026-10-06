import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerout");
export const onpointerout = descriptor.get;
export const setOnpointerout = descriptor.set;
