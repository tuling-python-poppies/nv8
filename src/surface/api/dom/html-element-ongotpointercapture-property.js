import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("ongotpointercapture");
export const ongotpointercapture = descriptor.get;
export const setOngotpointercapture = descriptor.set;
