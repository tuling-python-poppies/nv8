import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onfullscreenerror");
export const onfullscreenerror = descriptor.get;
export const setOnfullscreenerror = descriptor.set;
