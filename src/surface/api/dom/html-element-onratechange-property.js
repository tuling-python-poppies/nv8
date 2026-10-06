import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onratechange");
export const onratechange = descriptor.get;
export const setOnratechange = descriptor.set;
