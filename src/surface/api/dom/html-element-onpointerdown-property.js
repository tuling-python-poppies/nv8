import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointerdown");
export const onpointerdown = descriptor.get;
export const setOnpointerdown = descriptor.set;
