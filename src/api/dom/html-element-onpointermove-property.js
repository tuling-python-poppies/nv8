import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onpointermove");
export const onpointermove = descriptor.get;
export const setOnpointermove = descriptor.set;
