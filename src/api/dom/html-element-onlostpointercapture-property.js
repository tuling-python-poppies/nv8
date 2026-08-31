import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onlostpointercapture");
export const onlostpointercapture = descriptor.get;
export const setOnlostpointercapture = descriptor.set;
