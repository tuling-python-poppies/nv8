import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onreset");
export const onreset = descriptor.get;
export const setOnreset = descriptor.set;
